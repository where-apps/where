import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { Save, User, Globe, Bell, Moon, Sun } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const { colors, isDarkMode, setTheme } = useThemeStore();
  const { t, i18n } = useTranslation();
  
  const [username, setUsername] = useState(user?.username || '');
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would update the user's settings in the backend
    Alert.alert(t('success'), t('settings_saved'));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile_settings')}</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('username')}</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
              <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={username}
                onChangeText={setUsername}
                placeholder={t('enter_username')}
                placeholderTextColor={colors.textSecondary}
                editable={isAuthenticated}
              />
            </View>
            {!isAuthenticated && (
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                {t('login_to_change_username')}
              </Text>
            )}
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('appearance')}</Text>
          
          <View style={styles.settingRow}>
            {isDarkMode ? (
              <Moon size={20} color={colors.text} />
            ) : (
              <Sun size={20} color={colors.text} />
            )}
            <Text style={[styles.settingText, { color: colors.text }]}>{t('dark_mode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              { 
                backgroundColor: i18n.language === 'en' ? colors.primary + '20' : 'transparent',
                borderColor: i18n.language === 'en' ? colors.primary : colors.border
              }
            ]}
            onPress={() => changeLanguage('en')}
          >
            <Globe size={20} color={i18n.language === 'en' ? colors.primary : colors.text} />
            <Text style={[
              styles.languageText, 
              { color: i18n.language === 'en' ? colors.primary : colors.text }
            ]}>
              English
            </Text>
            {i18n.language === 'en' && (
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              { 
                backgroundColor: i18n.language === 'es' ? colors.primary + '20' : 'transparent',
                borderColor: i18n.language === 'es' ? colors.primary : colors.border
              }
            ]}
            onPress={() => changeLanguage('es')}
          >
            <Globe size={20} color={i18n.language === 'es' ? colors.primary : colors.text} />
            <Text style={[
              styles.languageText, 
              { color: i18n.language === 'es' ? colors.primary : colors.text }
            ]}>
              Español
            </Text>
            {i18n.language === 'es' && (
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              { 
                backgroundColor: i18n.language === 'fr' ? colors.primary + '20' : 'transparent',
                borderColor: i18n.language === 'fr' ? colors.primary : colors.border
              }
            ]}
            onPress={() => changeLanguage('fr')}
          >
            <Globe size={20} color={i18n.language === 'fr' ? colors.primary : colors.text} />
            <Text style={[
              styles.languageText, 
              { color: i18n.language === 'fr' ? colors.primary : colors.text }
            ]}>
              Français
            </Text>
            {i18n.language === 'fr' && (
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              { 
                backgroundColor: i18n.language === 'de' ? colors.primary + '20' : 'transparent',
                borderColor: i18n.language === 'de' ? colors.primary : colors.border
              }
            ]}
            onPress={() => changeLanguage('de')}
          >
            <Globe size={20} color={i18n.language === 'de' ? colors.primary : colors.text} />
            <Text style={[
              styles.languageText, 
              { color: i18n.language === 'de' ? colors.primary : colors.text }
            ]}>
              Deutsch
            </Text>
            {i18n.language === 'de' && (
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              { 
                backgroundColor: i18n.language === 'zh' ? colors.primary + '20' : 'transparent',
                borderColor: i18n.language === 'zh' ? colors.primary : colors.border
              }
            ]}
            onPress={() => changeLanguage('zh')}
          >
            <Globe size={20} color={i18n.language === 'zh' ? colors.primary : colors.text} />
            <Text style={[
              styles.languageText, 
              { color: i18n.language === 'zh' ? colors.primary : colors.text }
            ]}>
              中文
            </Text>
            {i18n.language === 'zh' && (
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('privacy')}</Text>
          
          <View style={styles.settingRow}>
            <Bell size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('notifications')}</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
          
          <View style={styles.settingRow}>
            <MapPin size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('location_sharing')}</Text>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveSettings}
        >
          <Save size={20} color={colors.card} />
          <Text style={[styles.saveButtonText, { color: colors.card }]}>{t('save_settings')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

import { MapPin } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  languageText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
