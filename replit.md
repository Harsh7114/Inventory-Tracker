# Inventory Management System

## Overview
A production-ready full-stack inventory management system with AI-powered voice-to-text functionality. Built with React, TypeScript, Express, PostgreSQL, and Vite. Speak naturally to add items to your inventory - powered by AssemblyAI and Google Gemini AI.

## Project Structure
- `client/` - Frontend React application
  - `src/` - React components, pages, and utilities
  - `public/` - Static assets
  - `vite.config.ts` - Vite configuration
- `server/` - Backend Express server
  - `db/` - Database configuration and migrations
    - `schema.ts` - Drizzle ORM schema with UUID primary keys
    - `index.ts` - PostgreSQL connection
    - `migrations/` - Generated SQL migrations
    - `seed.ts` - Database seeding script
  - `index.ts` - Server entry point
  - `routes.ts` - API route handlers with validation
  - `storage.ts` - Storage interface
  - `db-storage.ts` - PostgreSQL storage implementation
  - `voice.ts` - Voice processing with AssemblyAI + Gemini AI
  - `vite.ts` - Vite middleware
- `shared/` - Shared TypeScript types and schemas between client and server

## Features
- 📦 Complete Inventory Management (CRUD operations)
- 🎤 Voice-to-Text Integration - End-to-end automated workflow:
  1. Record audio naturally
  2. AssemblyAI transcribes speech
  3. Gemini AI parses items with schema validation
  4. Automatic database insertion with error handling
- 📊 Analytics Dashboard with charts
- 🔔 Smart Notifications system
- 💾 PostgreSQL Database with Drizzle ORM
- 🎨 Modern UI with dark mode support

## Technology Stack
- **Frontend**: React 18, TypeScript, Wouter, TanStack Query, Shadcn UI, Tailwind CSS
- **Backend**: Express, TypeScript, Multer (file uploads)
- **Database**: PostgreSQL with Drizzle ORM (UUID primary keys)
- **AI/ML**: AssemblyAI (speech-to-text), Google Gemini AI (natural language parsing with structured output)
- **Build Tool**: Vite
- **Validation**: Zod schemas with type safety

## Recent Changes (November 8, 2025)

### Database Migration to Production
- Migrated from in-memory storage to PostgreSQL with Drizzle ORM
- Database schema uses UUID primary keys (`.defaultRandom()`)
- Generated proper SQL migrations for version control
- Created seed script with sample inventory and notifications
- Implemented robust error handling and validation

### Voice Feature - Complete End-to-End Pipeline
- Audio upload with multer middleware
- AssemblyAI SDK integration (accepts buffers directly)
- Gemini AI structured output parsing with multiple response paths for compatibility
- **Schema validation** using `insertInventoryItemSchema.parse()` before database insertion
- Automatic database persistence with partial success support
- Returns detailed results including transcript, inserted items, and any failures

### Production Readiness
- Created comprehensive README.md with setup instructions
- Created DEPLOYMENT.md with production deployment guide
- Created .env.example for environment configuration
- Database scripts: `db:generate`, `db:push`, `db:seed`
- Proper error handling throughout the application
- Logging for debugging and monitoring

### Architecture Improvements
- Migrated from Lovable to Replit fullstack structure
- Proper client/server separation
- Type-safe API layer with Zod validation
- PostgreSQL storage layer implementing IStorage interface
- Configured Vite to run on port 5000 with proper host settings

## Development
Run `npm run dev` to start the development server. The application will be available on port 5000.

## Database Scripts
- `npm run db:generate` - Generate migrations from schema changes
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data

## API Endpoints
### Inventory (with Zod validation)
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get specific inventory item
- `POST /api/inventory` - Create new inventory item (validated)
- `PATCH /api/inventory/:id` - Update inventory item (validated)
- `DELETE /api/inventory/:id` - Delete inventory item

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification (validated)
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Voice Processing (Complete Pipeline)
- `POST /api/voice/process` - Upload audio → transcribe → parse → validate → insert into database
  - Returns: `{ transcript, items[], count, failed[] }`

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `ASSEMBLYAI_API_KEY` - AssemblyAI API key for speech-to-text
- `GEMINI_API_KEY` - Google Gemini API key for natural language parsing

## Database Schema
### inventory_items
- `id` (UUID, primary key)
- `name` (varchar)
- `quantity` (integer)
- `category` (varchar)
- `location` (varchar)
- `reorderThreshold` (integer)
- `lastUpdated` (timestamp)
- `createdAt` (timestamp)

### notifications
- `id` (UUID, primary key)
- `message` (text)
- `type` (varchar)
- `timestamp` (timestamp)
- `read` (boolean)
- `createdAt` (timestamp)

## User Preferences
None specified yet.
