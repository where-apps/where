import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_SIZE_BYTES = 50 * 1024 * 1024;

export type AllowedMime =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/svg+xml'
  | 'image/gif'
  | 'video/mp4'
  | 'video/webm'
  | 'video/quicktime'
  | 'video/ogg'
  | string;

export type S5UploadResult = {
  cid: string;
  gatewayUrl: string;
};

const API_BASE = (() => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return `${process.env.EXPO_PUBLIC_RORK_API_BASE_URL}/api`;
  }
  throw new Error('No API base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL');
})();

const S5_BASE = process.env.EXPO_PUBLIC_S5_BASE_URL ?? 'http://localhost:5050';

const RETRY_QUEUE_KEY = 's5_retry_queue_v1';
const RETRY_QUEUE_LIMIT = 20;

type RetryItem = {
  uri: string;
  name: string;
  type: string;
};

export function s5GatewayUrl(cid: string): string {
  return `${S5_BASE}/s5/gateway/${cid}`;
}

export async function uploadToS5(file: { uri: string; name: string; type: AllowedMime }): Promise<S5UploadResult> {
  const { uri, name, type } = file;
  console.log('[s5] upload start', { uri, name, type });

  if (!type || typeof type !== 'string') {
    throw new Error('Invalid file type');
  }

  const size = await getFileSize(uri);
  if (size !== null && size > MAX_SIZE_BYTES) {
    throw new Error('File exceeds 50MB limit');
  }

  const form = new FormData();
  form.append('file', { uri, name, type } as unknown as Blob);

  let res: Response | null = null;
  try {
    res = await fetch(`${API_BASE}/s5/upload`, {
      method: 'POST',
      body: form,
    });
  } catch (e) {
    console.log('[s5] upload network error, enqueue', e);
    await enqueueRetry({ uri, name, type });
    throw new Error('Network error. File cached for retry.');
  }

  if (!res.ok) {
    await enqueueRetry({ uri, name, type });
    const txt = await res.text().catch(() => 'Upload failed');
    console.log('[s5] upload server error', res.status, txt);
    throw new Error(txt);
  }

  const json = (await res.json()) as { cid?: string };
  if (!json?.cid) {
    await enqueueRetry({ uri, name, type });
    throw new Error('No CID returned from S5');
  }

  const gatewayUrl = s5GatewayUrl(json.cid);
  console.log('[s5] upload success', { cid: json.cid, gatewayUrl });
  return { cid: json.cid, gatewayUrl };
}

export async function retryFailedUploads(): Promise<number> {
  const q = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
  const items: RetryItem[] = q ? JSON.parse(q) : [];
  if (items.length === 0) return 0;

  const remaining: RetryItem[] = [];
  for (const it of items) {
    try {
      await uploadToS5(it);
    } catch (e) {
      remaining.push(it);
    }
  }
  await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(remaining));
  return remaining.length;
}

export async function clearS5RetryQueue(): Promise<void> {
  await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify([]));
}

async function enqueueRetry(item: RetryItem) {
  const q = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
  const items: RetryItem[] = q ? JSON.parse(q) : [];
  const exists = items.some((i) => i.uri === item.uri && i.name === item.name);
  const next = exists ? items : [...items.slice(-(RETRY_QUEUE_LIMIT - 1)), item];
  await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(next));
}

async function getFileSize(uri: string): Promise<number | null> {
  try {
    if (Platform.OS === 'web') {
      return null;
    }
    const fs = await import('expo-file-system');
    const info = await fs.getInfoAsync(uri);
    if (info.exists && typeof info.size === 'number') return info.size ?? null;
    return null;
  } catch (e) {
    console.log('[s5] getFileSize error', e);
    return null;
  }
}
