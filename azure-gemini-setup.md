# Azure VM Gemini setup

## 1) Create a Gemini API key
1. Go to https://aistudio.google.com/
2. Sign in with a Google account
3. Open API key / Get API key
4. Create a key

## 2) Put this in the Azure VM `.env`
```env
NODE_ENV=production
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
BETTER_AUTH_SECRET=Z5Z5JSMq6rpp/vMhxcPBV/RpnTw7XdWvL9x3bmjGnXY=
```

## 3) Reinstall and rebuild
```bash
bun install
bun run build
```

## 4) Restart the app process
Use your existing process manager or service restart.
