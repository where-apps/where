import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, LogIn, UserPlus, Settings, Info, Shield, MapPin, Award, Zap, Moon, Sun, Users, Globe } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { useReferralStore } from '@/store/referral-store';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isAnonymous, logout, loginWithGoogle, loginWithFarcaster } = useAuthStore();
  const { theme, setTheme, colors, isDarkMode } = useThemeStore();
  const { getReferralCount } = useReferralStore();
  const { t, i18n } = useTranslation();
  
  const referralCount = user ? getReferralCount(user.id) : 0;

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Google');
    }
  };
  
  const handleFarcasterLogin = async () => {
    try {
      if (Platform.OS === 'web') {
        await loginWithFarcaster();
      } else {
        Alert.alert('Not Available', 'Farcaster login is only available on web');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Farcaster');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logout_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('logout'), 
          style: 'destructive',
          onPress: () => {
            logout();
          }
        },
      ]
    );
  };
  
  const handleReferrals = () => {
    router.push('/referral');
  };
  
  const handleMyLocations = () => {
    router.push('/my-locations');
  };
  
  const handleSettings = () => {
    router.push('/settings');
  };
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  const changeLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const renderAuthenticatedContent = () => (
    <>
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        {user?.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.card }]}>{user?.username?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
        )}
        <Text style={[styles.username, { color: colors.text }]}>{user?.username || 'User'}</Text>
        <Text style={[styles.userType, { color: colors.textSecondary }]}>
          {user?.authProvider === 'email' ? t('email_user') : 
           user?.authProvider === 'google' ? t('google_user') : 
           user?.authProvider === 'farcaster' ? t('farcaster_user') : t('registered_user')}
        </Text>
        
        <View style={[styles.pointsContainer, { backgroundColor: colors.card }]}>
          <Zap size={20} color={colors.secondary} />
          <Text style={[styles.pointsText, { color: colors.text }]}>{user?.points?.toFixed(1) || '0'} {t('points')}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('account')}</Text>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={handleSettings}
        >
          <Settings size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('settings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={handleMyLocations}
        >
          <MapPin size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('my_locations')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Award size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('my_points')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={handleReferrals}
        >
          <Users size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('referrals')}</Text>
          {referralCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.card }]}>{referralCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Shield size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('privacy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Info size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('about')}</Text>
        </TouchableOpacity>
        <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          {isDarkMode ? (
            <Moon size={20} color={colors.text} />
          ) : (
            <Sun size={20} color={colors.text} />
          )}
          <Text style={[styles.menuText, { color: colors.text }]}>{t('dark_mode')}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.inactive, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={changeLanguage}
        >
          <Globe size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('language')}</Text>
          <Text style={[styles.languageText, { color: colors.primary }]}>
            {i18n.language === 'en' ? 'English' : 'Español'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.danger }]} 
        onPress={handleLogout}
      >
        <LogOut size={20} color={colors.danger} />
        <Text style={[styles.logoutText, { color: colors.danger }]}>{t('logout')}</Text>
      </TouchableOpacity>
    </>
  );

  const renderGuestContent = () => (
    <>
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.card }]}>G</Text>
        </View>
        <Text style={[styles.username, { color: colors.text }]}>{t('guest_user')}</Text>
        <Text style={[styles.userType, { color: colors.textSecondary }]}>{t('anonymous')}</Text>
        
        {user?.points && user.points > 0 && (
          <View style={[styles.pointsContainer, { backgroundColor: colors.card }]}>
            <Zap size={20} color={colors.secondary} />
            <Text style={[styles.pointsText, { color: colors.text }]}>{user.points.toFixed(1)} {t('points')}</Text>
          </View>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings')}</Text>
        <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          {isDarkMode ? (
            <Moon size={20} color={colors.text} />
          ) : (
            <Sun size={20} color={colors.text} />
          )}
          <Text style={[styles.menuText, { color: colors.text }]}>{t('dark_mode')}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.inactive, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={changeLanguage}
        >
          <Globe size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('language')}</Text>
          <Text style={[styles.languageText, { color: colors.primary }]}>
            {i18n.language === 'en' ? 'English' : 'Español'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Info size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('about')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.authButtons}>
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colors.primary }]} 
          onPress={handleLogin}
        >
          <LogIn size={20} color={colors.card} />
          <Text style={[styles.loginText, { color: colors.card }]}>{t('login')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.signupButton, { backgroundColor: colors.card, borderColor: colors.primary }]} 
          onPress={handleSignup}
        >
          <UserPlus size={20} color={colors.primary} />
          <Text style={[styles.signupText, { color: colors.primary }]}>{t('sign_up')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleText}>{t('sign_in_with_google')}</Text>
        </TouchableOpacity>
        
        {Platform.OS === 'web' && (
          <TouchableOpacity 
            style={[styles.farcasterButton, { backgroundColor: '#9B4DFF' }]} 
            onPress={handleFarcasterLogin}
          >
            <Text style={styles.farcasterText}>{t('sign_in_with_farcaster')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.contentContainer}
    >
      {isAuthenticated ? renderAuthenticatedContent() : renderGuestContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
    borderRadius: 12,
    padding: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 14,
    marginTop: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  authButtons: {
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  signupText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  googleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  farcasterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  farcasterText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
