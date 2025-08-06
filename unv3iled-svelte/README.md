# Unv3iled - Svelte Edition

A modern cultural intelligence companion built with **SvelteKit**, featuring AI-powered insights, real-time voice chat, and cross-platform media discovery.

## 🚀 Features

### 🧠 AI-Powered Cultural Intelligence
- **Gemini 2.5 Flash** integration for deep cultural analysis
- **Qloo Taste AI** for cross-domain taste mapping
- Real-time conversational AI with contextual understanding
- Personalized cultural insights and recommendations

### 🎵 Spotify Integration
- Seamless OAuth authentication
- Automatic token refresh handling
- Real-time listening history sync
- Top tracks, artists, and playlist analysis
- Cultural taste vector generation

### 🎤 Real-time Voice Interaction
- **ElevenLabs Speech-to-Text** for natural voice input
- **ElevenLabs Text-to-Speech** for AI voice responses
- Real-time voice processing with WebSocket support
- Multi-language voice recognition

### 🔍 Media Discovery
- **Spotify** embeds for tracks, albums, and playlists
- **YouTube** embeds for videos and channels
- **Google Books** embeds for book previews
- Unified search across all platforms
- Interactive media viewers

### 👥 Taste Twin Matching
- Cosine similarity algorithm for taste matching
- Real-time profile comparison
- Cultural compatibility scoring
- Connect with like-minded users

### 🎨 Modern Design System
- **Glass morphism** UI with backdrop blur effects
- **Modern blue/purple** color palette
- Smooth animations and transitions
- Responsive design for all devices
- Dark mode support

## 🛠 Tech Stack

### Frontend
- **SvelteKit 2.0** - Full-stack web framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Lucide Svelte** - Beautiful icons
- **Svelte Transitions** - Smooth animations

### Backend & APIs
- **Supabase** - Database, Auth, Edge Functions
- **Qloo API** - Cultural taste intelligence
- **Gemini 2.5 Flash** - AI insights and analysis
- **ElevenLabs** - Speech-to-Text & Text-to-Speech
- **Spotify Web API** - Music data and OAuth
- **YouTube Data API v3** - Video search and embeds
- **Google Books API** - Book information and previews

### Infrastructure
- **Vite** - Fast build tool and dev server
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- API keys for all services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unv3iled-svelte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   QLOO_API_KEY=your_qloo_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   YOUTUBE_API_KEY=your_youtube_api_key
   GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
unv3iled-svelte/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & types
│   ├── routes/
│   │   ├── +layout.svelte       # Main app layout
│   │   ├── +page.svelte         # Home page
│   │   ├── auth/
│   │   │   └── +page.svelte     # Authentication
│   │   ├── chat/
│   │   │   └── +page.svelte     # AI chat interface
│   │   ├── profile/
│   │   │   └── +page.svelte     # Taste profile
│   │   ├── media/
│   │   │   └── +page.svelte     # Media search
│   │   └── twins/
│   │       └── +page.svelte     # Taste twin matching
│   └── app.css                  # Global styles & design system
├── supabase/
│   └── functions/               # Edge functions
├── static/                      # Static assets
├── tailwind.config.js           # TailwindCSS configuration
└── package.json
```

## 🎯 Key Features

### Real-time Voice Chat
- Natural speech-to-text conversion
- AI-powered voice responses
- Multi-language support
- Real-time audio processing

### Cultural Intelligence Engine
- Cross-domain taste analysis
- Personalized recommendations
- Cultural pattern recognition
- Taste evolution tracking

### Media Discovery System
- Unified search across platforms
- Interactive media embeds
- Real-time content preview
- Cross-platform recommendations

### Taste Twin Matching
- Advanced similarity algorithms
- Real-time profile comparison
- Cultural compatibility scoring
- Social connection features

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type check with Svelte
- `npm run check:watch` - Watch mode type checking

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- SvelteKit conventions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `build` directory to your server
3. Configure environment variables

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `QLOO_API_KEY` | Qloo API key | ✅ |
| `GEMINI_API_KEY` | Gemini AI API key | ✅ |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | ✅ |
| `SPOTIFY_CLIENT_ID` | Spotify OAuth client ID | ✅ |
| `SPOTIFY_CLIENT_SECRET` | Spotify OAuth client secret | ✅ |
| `YOUTUBE_API_KEY` | YouTube Data API key | ✅ |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **SvelteKit** team for the amazing framework
- **Supabase** for the backend infrastructure
- **Qloo** for cultural intelligence APIs
- **Google** for Gemini AI and YouTube APIs
- **ElevenLabs** for voice technology
- **Spotify** for music data APIs

---

**Unv3iled** - Your cultural intelligence companion, reimagined with Svelte. 🚀
