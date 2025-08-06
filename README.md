# Taste Oracle - Advanced Svelte App

A modern, AI-powered taste discovery application built with Svelte, TypeScript, and Tailwind CSS. Features real AI integration, voice capabilities, and comprehensive media search.

## 🚀 Advanced Features

### 🤖 AI-Powered Chat Interface
- **Real OpenAI Integration**: Powered by GPT-4 for intelligent conversations
- **Personalized Responses**: Uses user profile data for tailored recommendations
- **Recommendation Parsing**: Automatically extracts and displays media recommendations
- **Context Awareness**: Maintains conversation history for coherent interactions

### 🎤 Voice Features
- **Speech Recognition**: Voice input for hands-free interaction
- **Text-to-Speech**: AI responses spoken aloud for accessibility
- **Real-time Voice Processing**: Instant voice input/output capabilities
- **Cross-browser Support**: Works with Web Speech API compatible browsers

### 🔍 Advanced Media Search
- **Multi-Platform Search**: Search across music, movies, books, and podcasts
- **Real API Integration**: Spotify, TMDB, Google Books APIs
- **Smart Filtering**: Filter by media type with instant results
- **Preference Saving**: Save discovered items to your profile
- **Fallback Mock Data**: Works without API keys for development

### 👤 User Profile System
- **Comprehensive Profiles**: Age, location, bio, and detailed preferences
- **Taste Vector Storage**: Numerical representation of user preferences
- **Preference Management**: Add/remove items from different categories
- **Taste Twin Discovery**: Find users with similar preferences
- **Real-time Updates**: Instant profile synchronization

### 🎯 Recommendation Engine
- **AI-Generated Recommendations**: Personalized suggestions based on user data
- **Cross-Domain Matching**: Find connections across different media types
- **Preference Learning**: System learns from user interactions
- **Smart Categorization**: Automatic classification of recommendations

## 🛠️ Tech Stack

- **Framework**: Svelte 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Services**: OpenAI GPT-4
- **Media APIs**: Spotify, TMDB, Google Books
- **Voice**: Web Speech API
- **Icons**: Lucide Svelte
- **Build Tool**: Vite
- **Routing**: Svelte Routing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taste-oracle-svelte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and configure your API keys:
   ```env
   # Required for authentication
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Required for AI chat
   VITE_OPENAI_API_KEY=your_openai_api_key
   
   # Optional: For real media search
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - TypeScript type checking
- `npm run lint` - ESLint linting

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (Button, Card, etc.)
│   ├── layout/        # Layout components (Navigation)
│   ├── chat/          # Chat interface components
│   └── auth/          # Authentication components
├── lib/               # Utilities and configurations
│   ├── services/      # API services (AI, Voice, Media, User Profile)
│   ├── stores/        # Svelte stores (auth, theme, toast)
│   └── supabase.ts    # Supabase client configuration
├── pages/             # Page components
└── main.ts           # Application entry point
```

### Key Services

#### AI Service (`src/lib/services/ai.ts`)
- OpenAI GPT-4 integration
- Chat message processing
- Recommendation parsing
- Fallback responses

#### Voice Service (`src/lib/services/voice.ts`)
- Speech recognition
- Text-to-speech synthesis
- Voice configuration
- Cross-browser compatibility

#### Media Search Service (`src/lib/services/mediaSearch.ts`)
- Multi-platform search
- Real API integration
- Mock data fallbacks
- Smart filtering

#### User Profile Service (`src/lib/services/userProfile.ts`)
- Profile management
- Preference tracking
- Taste vector storage
- Taste twin discovery

## 🎨 Advanced UI Components

### Chat Interface
- **Real-time Messaging**: Instant message updates
- **Voice Integration**: Speech input/output
- **Recommendation Cards**: Rich media suggestions
- **Loading States**: Beautiful animations

### Media Search
- **Advanced Filtering**: Type-based search
- **Rich Cards**: Detailed media information
- **Preference Saving**: One-click save to profile
- **Responsive Design**: Mobile-optimized layout

### Navigation
- **Smart Authentication**: Dynamic based on login state
- **Voice Indicators**: Shows voice capability
- **Mobile Menu**: Responsive navigation
- **User Display**: Shows user information

## 🔧 API Configuration

### Required APIs

#### Supabase
1. Create a Supabase project
2. Enable Google OAuth provider
3. Create `user_profiles` table with schema:
   ```sql
   CREATE TABLE user_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     email TEXT,
     age INTEGER,
     location TEXT,
     bio TEXT,
     preferences JSONB DEFAULT '{}',
     taste_vector REAL[],
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

#### OpenAI
1. Get API key from OpenAI platform
2. Add to environment variables
3. Configure for GPT-4 access

### Optional APIs

#### Spotify
1. Create Spotify app in developer dashboard
2. Get client ID and secret
3. Configure redirect URIs

#### TMDB (Movies)
1. Register at themoviedb.org
2. Get API key
3. Enable movie search

#### Google Books
1. Enable Google Books API
2. Get API key
3. Configure quotas

## 🚀 Deployment

The app is ready for deployment on platforms like:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables
Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Svelte and powered by AI**
