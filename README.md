# Taste Oracle - Svelte App

A modern, AI-powered taste discovery application built with Svelte, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **AI Chat Interface**: Interactive chat with an AI taste companion
- **Authentication**: Google OAuth integration with Supabase
- **Theme System**: Light/dark mode with system preference detection
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Toast Notifications**: Real-time feedback system

### Pages & Components
- **Landing Page**: Beautiful hero section with feature highlights
- **Dashboard**: Personalized user dashboard with quick access cards
- **Chat Interface**: AI-powered conversation for taste discovery
- **Authentication**: Secure sign-in/sign-out flow
- **Navigation**: Global navigation with mobile menu
- **Settings**: User preferences and account management

## 🛠️ Tech Stack

- **Framework**: Svelte 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
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
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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
│   ├── stores/        # Svelte stores (auth, theme, toast)
│   └── supabase.ts    # Supabase client configuration
├── pages/             # Page components
└── main.ts           # Application entry point
```

### Key Features

#### Authentication System
- Google OAuth integration
- Session management with Supabase
- Protected routes
- User state management

#### Theme System
- Light/dark mode toggle
- System preference detection
- Persistent theme storage
- Smooth transitions

#### Chat Interface
- Real-time messaging
- AI-powered responses
- Message history
- Loading states

#### Toast Notifications
- Multiple notification types (success, error, warning, info)
- Auto-dismiss functionality
- Smooth animations
- Global state management

## 🎨 UI Components

The app uses a custom component library built with:
- **Button**: Multiple variants and sizes
- **Card**: Flexible card components
- **Navigation**: Responsive navigation with mobile menu
- **Theme Toggle**: Light/dark mode switcher
- **Toast**: Notification system

## 🔧 Configuration

### Supabase Setup
1. Create a Supabase project
2. Enable Google OAuth provider
3. Add your domain to the allowed redirect URLs
4. Update environment variables

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

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

**Built with ❤️ using Svelte**
