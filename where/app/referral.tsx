import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, TextInput, Alert, ScrollView } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { useReferralStore } from '@/store/referral-store';
import { Copy, Share as ShareIcon, Users, Gift } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';

export default function ReferralScreen() {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const { generateReferralCode, getReferralCode, getReferralCount } = useReferralStore();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralInput, setReferralInput] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      // Get or generate referral code
      let code = getReferralCode(user.id);
      if (!code) {
        code = generateReferralCode(user.id);
      }
      setReferralCode(code);
      
      // Get referral count
      setReferralCount(getReferralCount(user.id));
    }
  }, [user]);

  const handleCopyCode = async () => {
    if (referralCode) {
      await Clipboard.setStringAsync(referralCode);
      Alert.alert(t('success'), t('referral_code_copied'));
    }
  };

  const handleShare = async () => {
    if (referralCode) {
      try {
        await Share.share({
          message: `${t('join_me_on_where')} ${referralCode} ${t('to_get_started')}`,
        });
      } catch (error) {
        Alert.alert(t('error'), t('failed_to_share'));
      }
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Users size={40} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{t('invite_friends')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('earn_points_for_referrals')}
          </Text>
        </View>
        
        <View style={[styles.codeContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.codeLabel, { color: colors.textSecondary }]}>{t('your_referral_code')}</Text>
          <View style={[styles.codeBox, { borderColor: colors.border }]}>
            <Text style={[styles.code, { color: colors.primary }]}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Copy size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.shareButton, { backgroundColor: colors.primary }]}
            onPress={handleShare}
          >
            <ShareIcon size={20} color={colors.card} />
            <Text style={[styles.shareButtonText, { color: colors.card }]}>{t('share_referral_code')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{referralCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('friends_referred')}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{referralCount * 5}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('points_earned')}</Text>
          </View>
        </View>
        
        <View style={[styles.howItWorksContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('how_it_works')}</Text>
          
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>{t('share_code_with_friends')}</Text>
          </View>
          
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>{t('they_sign_up')}</Text>
          </View>
          
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>{t('earn_points_per_referral')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  codeContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  copyButton: {
    padding: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  howItWorksContainer: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    flex: 1,
  },
});
