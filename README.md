# Where
a cross-platform mobile application designed to give users a holistic and transparent outlook on specific locations.
Where utilizes Sia decentralized storage network via S5 for storage

# Architecture
#### Front-end: The frontend Leverages React Native to build cross-platform apps from a unified codebase.
#### Back-end: Hono for its lightweight, high-performance backend architecture hosted on Render https://where-1.onrender.com
#### Storage: Sia decentralized storage network.

## Setup
#### 1. clone the repository:
```
git clone https://github.com/where-apps/where.git
```

#### 2. Run renterd:
follow instructions in the doc to run zen testnet https://docs.sia.tech/zen-testnet
#### 3. Install S5 node:
follow instructions in the doc to setup S5 node https://docs.sfive.net/install/index.html. 
You can replace my S5_ADMIN_API_KEY and S5_BASE_URL with yours after setting up s5 node.

## Build
#### - Log in to expo
#### - Generate credentials for Android and IOS:
in your projects root folder, run: 
```
eas credentials
```
#### - You can build directly from expo.dev or in your terminal, run:
```
eas build --platform all (or specify)
```

## Auth
#### - Utilzed SupaBase to handle user auth data:
- 1. log in to google cloud console, setup OAuth client under API & Services
- 2. In the Auth providers section, enable sign-in with Google and input your client ID, Secret(for OAth) and callback url
- 3. You can find your API keys In your Supabase project settings
