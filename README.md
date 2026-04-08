# OpsAI - React SaaS Application

A modern React-based SaaS application with workspace isolation, authentication, and AI-powered task management.

## Features

- **Google OAuth Authentication** with secure session management
- **Automatic Session Restoration** - User tokens and info persist across page refreshes
- **Workspace-based Data Isolation** - Complete data separation between workspaces
- **Real-time Updates** with Supabase subscriptions
- **AI Command Interface** for task automation
- **Lead Management** with conversation tracking
- **Task Management** with Kanban board
- **Professional UI** with light mode design and animations

## Authentication Flow

The app implements robust authentication with automatic session restoration:

1. **Session Persistence**: User sessions are automatically restored on page refresh
2. **Token Management**: JWT tokens are securely stored and managed by Supabase
3. **Workspace Verification**: Users are automatically redirected to appropriate pages based on authentication and workspace status
4. **Real-time Auth State**: Authentication state changes are handled in real-time across all components

### Session Restoration Process

- On page load, the app automatically attempts to restore the user's session from localStorage
- Auth state changes are monitored in real-time
- Users are seamlessly redirected to the appropriate page (dashboard, workspace setup, or login)
- Loading states provide feedback during session restoration

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (Database + Auth + Real-time)
- **API**: FastAPI (for AI command processing)
- **Deployment**: Netlify/Vercel ready

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

For production, set `VITE_API_URL` to your deployed FastAPI backend URL.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with required variables
4. Start development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

## Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure `_redirects` file for SPA routing

### Backend (FastAPI)
Deploy your FastAPI application separately and update `VITE_API_URL` accordingly.

## Database Schema

The application uses Supabase with the following tables:
- `workspaces` - User workspaces
- `leads` - Lead/contact information
- `messages` - Chat messages
- `commands` - AI commands
- `tasks` - Task management
- `workspace_settings` - Workspace configuration

## Security Features

- **Workspace Isolation**: All data operations are scoped by workspace_id
- **Authentication Verification**: Protected routes with session validation
- **Real-time Security**: Subscriptions filtered by workspace ownership
- **Input Validation**: UUID validation and error handling

## Development

- Uses ESLint for code quality
- Hot reload with Vite
- Component-based architecture
- Responsive design with Tailwind CSS

## Production Checklist

- ✅ Environment variables configured
- ✅ Build successful
- ✅ Authentication working
- ✅ Workspace isolation implemented
- ✅ API endpoints configured
- ✅ SPA routing configured (_redirects)
- ✅ Error handling implemented
- ✅ Loading states handled