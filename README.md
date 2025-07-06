# Chess Arena - Frontend

A modern, real-time multiplayer chess platform built with Next.js, featuring live games, tournaments, and comprehensive player statistics.

## Features

- 🎮 **Real-time Multiplayer Chess** - Play live games with players worldwide
- 🏆 **Tournaments** - Participate in organized chess tournaments
- 📊 **Statistics & Analytics** - Detailed game history and performance metrics
- 🏅 **Leaderboards** - Global and category-specific rankings
- 💬 **Live Chat** - Chat with opponents and spectators during games
- 🎥 **Game Replay** - Review and analyze past games
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🔐 **Secure Authentication** - JWT-based authentication system

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Chess Logic**: chess.js
- **Chess Board**: react-chessboard
- **Real-time**: Socket.IO Client
- **Notifications**: Sonner
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd chess-arena
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your configuration:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── lobby/             # Game lobby
│   ├── room/              # Game rooms
│   ├── replay/            # Game replay system
│   ├── tournaments/       # Tournament pages
│   ├── leaderboard/       # Leaderboard pages
│   └── profile/           # User profiles
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── chess/             # Chess-related components
│   ├── lobby/             # Lobby components
│   ├── room/              # Game room components
│   ├── replay/            # Replay components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── public/                # Static assets
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Key Features

### Authentication
- Secure JWT-based authentication
- User registration and login
- Profile management
- Session persistence

### Game System
- Real-time chess games
- Multiple time controls (bullet, blitz, rapid, classical)
- Game types (casual, ranked, tournament)
- Move validation and game state management
- Spectator mode

### Social Features
- Live chat during games
- Player profiles and statistics
- Global leaderboards
- Game history and replays

### Tournament System
- Tournament creation and management
- Multiple tournament formats
- Real-time tournament updates
- Prize pools and rankings

## State Management

The application uses Zustand for state management with the following stores:

- **Auth Store** - User authentication and profile data
- **Game Store** - Current game state and moves
- **Lobby Store** - Room listings and lobby data
- **Chat Store** - Chat messages and history
- **Leaderboard Store** - Rankings and statistics

## API Integration

The frontend communicates with the backend through:

- **REST API** - Standard CRUD operations
- **Socket.IO** - Real-time game updates and chat
- **Authentication** - JWT tokens with HTTP-only cookies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@chessarena.com or join our Discord server.
