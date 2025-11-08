# Inventory Management System

## Overview
This is a full-stack inventory management system built with React, TypeScript, Express, and Vite. The application was migrated from Lovable to the Replit environment following the fullstack JavaScript template structure.

## Project Structure
- `client/` - Frontend React application
  - `src/` - React components, pages, and utilities
  - `public/` - Static assets
  - `vite.config.ts` - Vite configuration
- `server/` - Backend Express server
  - `index.ts` - Server entry point
  - `routes.ts` - API route handlers
  - `storage.ts` - In-memory storage implementation
  - `vite.ts` - Vite middleware for development
- `shared/` - Shared TypeScript types and schemas between client and server

## Features
- Dashboard with inventory overview
- Inventory management (CRUD operations)
- Analytics page
- Notifications system
- **Voice-to-text integration** - Speak to add inventory items using AssemblyAI and Gemini AI
- User authentication (sign up/sign in)

## Technology Stack
- **Frontend**: React 18, TypeScript, React Router, TanStack Query, Shadcn UI
- **Backend**: Express, TypeScript, Multer (file uploads)
- **AI/ML**: AssemblyAI (speech-to-text), Gemini AI (natural language parsing)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, Recharts
- **Forms**: React Hook Form with Zod validation

## Recent Changes
- Added voice-to-text feature with AssemblyAI and Gemini AI (November 8, 2025)
  - Records audio using MediaRecorder API
  - Transcribes speech using AssemblyAI
  - Parses inventory items using Gemini AI
  - Automatically adds items with intelligent category and location detection
- Updated shared schema to include `reorderThreshold` field
- Migrated from Lovable to Replit fullstack structure (November 8, 2025)
- Created proper client/server separation
- Set up Express backend with API routes
- Implemented in-memory storage for inventory and notifications
- Configured Vite to run on port 5000 with proper host settings

## Development
Run `npm run dev` to start the development server. The application will be available on port 5000.

## API Endpoints
### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get specific inventory item
- `POST /api/inventory` - Create new inventory item
- `PATCH /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Voice Processing
- `POST /api/voice/process` - Upload audio file, transcribe with AssemblyAI, parse items with Gemini AI

## Environment Variables
- `ASSEMBLYAI_API_KEY` - AssemblyAI API key for speech-to-text transcription
- `GEMINI_API_KEY` - Google Gemini API key for natural language parsing

## User Preferences
None specified yet.
