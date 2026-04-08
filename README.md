# OpsAI - React SaaS Application

A modern React-based SaaS application with workspace isolation, authentication, and AI-powered task management.

## Features

- **Google OAuth Authentication** with secure session management
- **Workspace-based Data Isolation** - Complete data separation between workspaces
- **Real-time Updates** with Supabase subscriptions
- **AI Command Interface** for task automation
- **Lead Management** with conversation tracking
- **Task Management** with Kanban board
- **Professional UI** with light mode design and animations

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