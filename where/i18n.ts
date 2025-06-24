import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  // General
  loading: 'Loading...',
  cancel: 'Cancel',
  save: 'Save',
  add: 'Add',
  
  // Map screen
  loading_locations: 'Loading locations...',
  
  // Search screen
  search_locations: 'Search locations...',
  no_locations_found_for: 'No locations found for',
  no_locations_available: 'No locations available',
  locations_will_appear: 'Locations will appear here once added',
  
  // Profile screen
  guest_user: 'Guest User',
  anonymous: 'Anonymous',
  email_user: 'Email User',
  google_user: 'Google User',
  farcaster_user: 'Farcaster User',
  registered_user: 'Registered User',
  points: 'Points',
  account: 'Account',
  settings: 'Settings',
  my_locations: 'My Locations',
  my_points: 'My Points',
  referrals: 'Referrals',
  privacy: 'Privacy',
  about: 'About',
  dark_mode: 'Dark Mode',
  language: 'Language',
  logout: 'Logout',
  logout_confirmation: 'Are you sure you want to logout?',
  login: 'Login',
  sign_up: 'Sign Up',
  sign_in_with_google: 'Sign in with Google',
  sign_in_with_farcaster: 'Sign in with Farcaster',
  
  // My Locations
  your_locations: 'Your Locations',
  no_locations_created: 'You haven\'t created any locations yet',
  add_your_first_location: 'Add your first location to share with others',
  add_location: 'Add Location',
  
  // Settings
  profile_settings: 'Profile Settings',
  username: 'Username',
  enter_username: 'Enter username',
  login_to_change_username: 'Login to change your username',
  appearance: 'Appearance',
  notifications: 'Notifications',
  location_sharing: 'Location Sharing',
  save_settings: 'Save Settings',
  success: 'Success',
  settings_saved: 'Your settings have been saved',
  
  // Image Carousel
  add_image: 'Add Image',
  view_all: 'View All',
  
  // Referrals
  invite_friends: 'Invite Friends',
  earn_points_for_referrals: 'Earn 5 points for each friend who joins using your referral code',
  your_referral_code: 'Your Referral Code',
  share_referral_code: 'Share Referral Code',
  friends_referred: 'Friends Referred',
  points_earned: 'Points Earned',
  how_it_works: 'How It Works',
  share_code_with_friends: 'Share your referral code with friends',
  they_sign_up: 'They sign up using your code',
  earn_points_per_referral: 'Earn 5 points for each successful referral',
  join_me_on_where: 'Join me on Where! Use my referral code',
  to_get_started: 'to get started!',
  referral_code_copied: 'Referral code copied to clipboard',
  failed_to_share: 'Failed to share referral code',
};

// Spanish translations
const esTranslations = {
  // General
  loading: 'Cargando...',
  cancel: 'Cancelar',
  save: 'Guardar',
  add: 'Añadir',
  
  // Map screen
  loading_locations: 'Cargando ubicaciones...',
  
  // Search screen
  search_locations: 'Buscar ubicaciones...',
  no_locations_found_for: 'No se encontraron ubicaciones para',
  no_locations_available: 'No hay ubicaciones disponibles',
  locations_will_appear: 'Las ubicaciones aparecerán aquí una vez añadidas',
  
  // Profile screen
  guest_user: 'Usuario Invitado',
  anonymous: 'Anónimo',
  email_user: 'Usuario de Email',
  google_user: 'Usuario de Google',
  farcaster_user: 'Usuario de Farcaster',
  registered_user: 'Usuario Registrado',
  points: 'Puntos',
  account: 'Cuenta',
  settings: 'Configuración',
  my_locations: 'Mis Ubicaciones',
  my_points: 'Mis Puntos',
  referrals: 'Referencias',
  privacy: 'Privacidad',
  about: 'Acerca de',
  dark_mode: 'Modo Oscuro',
  language: 'Idioma',
  logout: 'Cerrar Sesión',
  logout_confirmation: '¿Estás seguro de que quieres cerrar sesión?',
  login: 'Iniciar Sesión',
  sign_up: 'Registrarse',
  sign_in_with_google: 'Iniciar sesión con Google',
  sign_in_with_farcaster: 'Iniciar sesión con Farcaster',
  
  // My Locations
  your_locations: 'Tus Ubicaciones',
  no_locations_created: 'Aún no has creado ninguna ubicación',
  add_your_first_location: 'Añade tu primera ubicación para compartir con otros',
  add_location: 'Añadir Ubicación',
  
  // Settings
  profile_settings: 'Configuración de Perfil',
  username: 'Nombre de Usuario',
  enter_username: 'Ingresa nombre de usuario',
  login_to_change_username: 'Inicia sesión para cambiar tu nombre de usuario',
  appearance: 'Apariencia',
  notifications: 'Notificaciones',
  location_sharing: 'Compartir Ubicación',
  save_settings: 'Guardar Configuración',
  success: 'Éxito',
  settings_saved: 'Tu configuración ha sido guardada',
  
  // Image Carousel
  add_image: 'Añadir Imagen',
  view_all: 'Ver Todo',
  
  // Referrals
  invite_friends: 'Invitar Amigos',
  earn_points_for_referrals: 'Gana 5 puntos por cada amigo que se una usando tu código de referencia',
  your_referral_code: 'Tu Código de Referencia',
  share_referral_code: 'Compartir Código',
  friends_referred: 'Amigos Referidos',
  points_earned: 'Puntos Ganados',
  how_it_works: 'Cómo Funciona',
  share_code_with_friends: 'Comparte tu código con amigos',
  they_sign_up: 'Ellos se registran usando tu código',
  earn_points_per_referral: 'Gana 5 puntos por cada referencia exitosa',
  join_me_on_where: '¡Únete a Where! Usa mi código de referencia',
  to_get_started: 'para comenzar!',
  referral_code_copied: 'Código de referencia copiado al portapapeles',
  failed_to_share: 'Error al compartir el código de referencia',
};

// French translations
const frTranslations = {
  // General
  loading: 'Chargement...',
  cancel: 'Annuler',
  save: 'Enregistrer',
  add: 'Ajouter',
  
  // Map screen
  loading_locations: 'Chargement des emplacements...',
  
  // Search screen
  search_locations: 'Rechercher des emplacements...',
  no_locations_found_for: 'Aucun emplacement trouvé pour',
  no_locations_available: 'Aucun emplacement disponible',
  locations_will_appear: 'Les emplacements apparaîtront ici une fois ajoutés',
  
  // Profile screen
  guest_user: 'Utilisateur Invité',
  anonymous: 'Anonyme',
  email_user: 'Utilisateur Email',
  google_user: 'Utilisateur Google',
  farcaster_user: 'Utilisateur Farcaster',
  registered_user: 'Utilisateur Enregistré',
  points: 'Points',
  account: 'Compte',
  settings: 'Paramètres',
  my_locations: 'Mes Emplacements',
  my_points: 'Mes Points',
  referrals: 'Parrainages',
  privacy: 'Confidentialité',
  about: 'À propos',
  dark_mode: 'Mode Sombre',
  language: 'Langue',
  logout: 'Déconnexion',
  logout_confirmation: 'Êtes-vous sûr de vouloir vous déconnecter?',
  login: 'Connexion',
  sign_up: 'S\'inscrire',
  sign_in_with_google: 'Se connecter avec Google',
  sign_in_with_farcaster: 'Se connecter avec Farcaster',
  
  // My Locations
  your_locations: 'Vos Emplacements',
  no_locations_created: 'Vous n\'avez pas encore créé d\'emplacements',
  add_your_first_location: 'Ajoutez votre premier emplacement à partager avec d\'autres',
  add_location: 'Ajouter un Emplacement',
  
  // Settings
  profile_settings: 'Paramètres du Profil',
  username: 'Nom d\'utilisateur',
  enter_username: 'Entrez le nom d\'utilisateur',
  login_to_change_username: 'Connectez-vous pour changer votre nom d\'utilisateur',
  appearance: 'Apparence',
  notifications: 'Notifications',
  location_sharing: 'Partage de Localisation',
  save_settings: 'Enregistrer les Paramètres',
  success: 'Succès',
  settings_saved: 'Vos paramètres ont été enregistrés',
  
  // Image Carousel
  add_image: 'Ajouter une Image',
  view_all: 'Voir Tout',
  
  // Referrals
  invite_friends: 'Inviter des Amis',
  earn_points_for_referrals: 'Gagnez 5 points pour chaque ami qui rejoint en utilisant votre code de parrainage',
  your_referral_code: 'Votre Code de Parrainage',
  share_referral_code: 'Partager le Code',
  friends_referred: 'Amis Parrainés',
  points_earned: 'Points Gagnés',
  how_it_works: 'Comment Ça Marche',
  share_code_with_friends: 'Partagez votre code avec vos amis',
  they_sign_up: 'Ils s\'inscrivent en utilisant votre code',
  earn_points_per_referral: 'Gagnez 5 points pour chaque parrainage réussi',
  join_me_on_where: 'Rejoignez-moi sur Where! Utilisez mon code de parrainage',
  to_get_started: 'pour commencer!',
  referral_code_copied: 'Code de parrainage copié dans le presse-papiers',
  failed_to_share: 'Échec du partage du code de parrainage',
};

// German translations
const deTranslations = {
  // General
  loading: 'Wird geladen...',
  cancel: 'Abbrechen',
  save: 'Speichern',
  add: 'Hinzufügen',
  
  // Map screen
  loading_locations: 'Standorte werden geladen...',
  
  // Search screen
  search_locations: 'Standorte suchen...',
  no_locations_found_for: 'Keine Standorte gefunden für',
  no_locations_available: 'Keine Standorte verfügbar',
  locations_will_appear: 'Standorte werden hier angezeigt, sobald sie hinzugefügt wurden',
  
  // Profile screen
  guest_user: 'Gastbenutzer',
  anonymous: 'Anonym',
  email_user: 'E-Mail-Benutzer',
  google_user: 'Google-Benutzer',
  farcaster_user: 'Farcaster-Benutzer',
  registered_user: 'Registrierter Benutzer',
  points: 'Punkte',
  account: 'Konto',
  settings: 'Einstellungen',
  my_locations: 'Meine Standorte',
  my_points: 'Meine Punkte',
  referrals: 'Empfehlungen',
  privacy: 'Datenschutz',
  about: 'Über',
  dark_mode: 'Dunkelmodus',
  language: 'Sprache',
  logout: 'Abmelden',
  logout_confirmation: 'Sind Sie sicher, dass Sie sich abmelden möchten?',
  login: 'Anmelden',
  sign_up: 'Registrieren',
  sign_in_with_google: 'Mit Google anmelden',
  sign_in_with_farcaster: 'Mit Farcaster anmelden',
  
  // My Locations
  your_locations: 'Ihre Standorte',
  no_locations_created: 'Sie haben noch keine Standorte erstellt',
  add_your_first_location: 'Fügen Sie Ihren ersten Standort hinzu, um ihn mit anderen zu teilen',
  add_location: 'Standort hinzufügen',
  
  // Settings
  profile_settings: 'Profileinstellungen',
  username: 'Benutzername',
  enter_username: 'Benutzernamen eingeben',
  login_to_change_username: 'Melden Sie sich an, um Ihren Benutzernamen zu ändern',
  appearance: 'Erscheinungsbild',
  notifications: 'Benachrichtigungen',
  location_sharing: 'Standortfreigabe',
  save_settings: 'Einstellungen speichern',
  success: 'Erfolg',
  settings_saved: 'Ihre Einstellungen wurden gespeichert',
  
  // Image Carousel
  add_image: 'Bild hinzufügen',
  view_all: 'Alle anzeigen',
  
  // Referrals
  invite_friends: 'Freunde einladen',
  earn_points_for_referrals: 'Verdienen Sie 5 Punkte für jeden Freund, der mit Ihrem Empfehlungscode beitritt',
  your_referral_code: 'Ihr Empfehlungscode',
  share_referral_code: 'Code teilen',
  friends_referred: 'Empfohlene Freunde',
  points_earned: 'Verdiente Punkte',
  how_it_works: 'Wie es funktioniert',
  share_code_with_friends: 'Teilen Sie Ihren Code mit Freunden',
  they_sign_up: 'Sie melden sich mit Ihrem Code an',
  earn_points_per_referral: 'Verdienen Sie 5 Punkte für jede erfolgreiche Empfehlung',
  join_me_on_where: 'Tritt mir auf Where bei! Verwende meinen Empfehlungscode',
  to_get_started: 'um loszulegen!',
  referral_code_copied: 'Empfehlungscode in die Zwischenablage kopiert',
  failed_to_share: 'Fehler beim Teilen des Empfehlungscodes',
};

// Chinese translations
const zhTranslations = {
  // General
  loading: '加载中...',
  cancel: '取消',
  save: '保存',
  add: '添加',
  
  // Map screen
  loading_locations: '正在加载位置...',
  
  // Search screen
  search_locations: '搜索位置...',
  no_locations_found_for: '未找到位置',
  no_locations_available: '没有可用的位置',
  locations_will_appear: '添加后位置将显示在这里',
  
  // Profile screen
  guest_user: '访客用户',
  anonymous: '匿名',
  email_user: '邮箱用户',
  google_user: 'Google用户',
  farcaster_user: 'Farcaster用户',
  registered_user: '注册用户',
  points: '积分',
  account: '账户',
  settings: '设置',
  my_locations: '我的位置',
  my_points: '我的积分',
  referrals: '推荐',
  privacy: '隐私',
  about: '关于',
  dark_mode: '深色模式',
  language: '语言',
  logout: '退出登录',
  logout_confirmation: '确定要退出登录吗？',
  login: '登录',
  sign_up: '注册',
  sign_in_with_google: '使用Google登录',
  sign_in_with_farcaster: '使用Farcaster登录',
  
  // My Locations
  your_locations: '您的位置',
  no_locations_created: '您还没有创建任何位置',
  add_your_first_location: '添加您的第一个位置与他人分享',
  add_location: '添加位置',
  
  // Settings
  profile_settings: '个人资料设置',
  username: '用户名',
  enter_username: '输入用户名',
  login_to_change_username: '登录以更改您的用户名',
  appearance: '外观',
  notifications: '通知',
  location_sharing: '位置共享',
  save_settings: '保存设置',
  success: '成功',
  settings_saved: '您的设置已保存',
  
  // Image Carousel
  add_image: '添加图片',
  view_all: '查看全部',
  
  // Referrals
  invite_friends: '邀请朋友',
  earn_points_for_referrals: '每位使用您的推荐码加入的朋友可获得5积分',
  your_referral_code: '您的推荐码',
  share_referral_code: '分享推荐码',
  friends_referred: '已推荐的朋友',
  points_earned: '获得的积分',
  how_it_works: '如何运作',
  share_code_with_friends: '与朋友分享您的推荐码',
  they_sign_up: '他们使用您的推荐码注册',
  earn_points_per_referral: '每次成功推荐获得5积分',
  join_me_on_where: '加入我在Where！使用我的推荐码',
  to_get_started: '开始使用！',
  referral_code_copied: '推荐码已复制到剪贴板',
  failed_to_share: '分享推荐码失败',
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      de: { translation: deTranslations },
      zh: { translation: zhTranslations }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
