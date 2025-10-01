import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

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
    return ${process.env.EXPO_PUBLIC_RORK_API_BASE_URL}/api;
  }
  throw new Error('No API base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL');
})();

const RETRY_QUEUE_KEY = 's5_retry_queue_v1';

type RetryItem = {
  uri: string;
  name: string;
  type: string;
};

export async function uploadToS5(file: { uri: string; name: string; type: AllowedMime }): Promise<S5UploadResult> {
  const { uri, name, type } = file;

  const size = await getFileSize(uri);
  if (size !== null && size > MAX_SIZE_BYTES) {
    throw new Error('File exceeds 50MB limit');
  }

  const form = new FormData();
  form.append('file', { uri, name, type } as any);

  let res: Response | null = null;
  try {
    res = await fetch(${API_BASE}/s5/upload, {
      method: 'POST',
      body: form,
    });
  } catch (e) {
    await enqueueRetry({ uri, name, type });
    throw new Error('Network error. File cached for retry.');
  }

  if (!res.ok) {
    await enqueueRetry({ uri, name, type });
    const txt = await res.text().catch(() => 'Upload failed');
    throw new Error(txt);
  }

  const json = (await res.json()) as { cid?: string };
  if (!json.cid) {
    await enqueueRetry({ uri, name, type });
    throw new Error('No CID returned from S5');
  }

  const gatewayUrl = `http://localhost:5050/s5/gateway/${json.cid}`;
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

async function enqueueRetry(item: RetryItem) {
  const q = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
  const items: RetryItem[] = q ? JSON.parse(q) : [];
  items.push(item);
  await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(items));
}

async function getFileSize(uri: string): Promise<number | null> {
  try {
    if (Platform.OS === 'web') {
      return null;
    }
    const fs = await import('expo-file-system');
    const info = await fs.getInfoAsync(uri);
    if (info.exists && typeof info.size === 'number') return info.size;
    return null;
  } catch {
    return null;
  }
}
