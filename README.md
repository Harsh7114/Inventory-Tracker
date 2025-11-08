# 🎙️ Smart Grocery Inventory Tracker

A full-stack inventory management system with AI-powered voice-to-text functionality. Speak naturally to add items to your inventory - powered by AssemblyAI and Google Gemini AI.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- 📦 **Complete Inventory Management** - Add, edit, delete, and track inventory items
- 🎤 **Voice-to-Text Integration** - Speak to add items naturally: "Add 5 apples and 2 bottles of milk"
- 📊 **Analytics Dashboard** - Visual charts and insights for your inventory
- 🔔 **Smart Notifications** - Low stock alerts and reorder reminders
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 💾 **PostgreSQL Database** - Production-ready data persistence with Drizzle ORM

## 🤖 AI-Powered Voice Feature

The voice feature provides end-to-end automation: speak naturally to add items, and they're automatically saved to your inventory.

**Complete Workflow:**
1. **Record** - Speak naturally: "Add 5 apples and 2 bottles of milk"
2. **Transcribe** - AssemblyAI converts speech to text
3. **Parse** - Google Gemini AI intelligently extracts:
   - Item name (e.g., "apples", "milk")
   - Quantity (defaults to 1 if not specified)
   - Category (Fruits, Dairy, Vegetables, etc.)
   - Storage location (Fridge, Pantry, Counter, Freezer)
   - Reorder threshold (intelligent defaults based on item type)
4. **Save** - Items are automatically inserted into the database

**Result:** Items appear in your inventory instantly - no manual typing required!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- AssemblyAI API key ([Get it here](https://www.assemblyai.com/))
- Google Gemini API key ([Get it here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd inventory-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with initial data (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and API client
│   │   └── types/        # TypeScript type definitions
│   └── vite.config.ts
│
├── server/                # Backend Express server
│   ├── db/               # Database configuration and schema
│   │   ├── schema.ts    # Drizzle ORM schema
│   │   ├── index.ts     # Database connection
│   │   └── seed.ts      # Database seeding script
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Storage interface
│   ├── db-storage.ts    # PostgreSQL storage implementation
│   ├── voice.ts         # Voice processing logic
│   └── vite.ts          # Vite middleware
│
├── shared/               # Shared types between client and server
│   └── schema.ts
│
└── drizzle.config.ts    # Drizzle ORM configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **Chart.js & Recharts** - Data visualization

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **AssemblyAI** - Speech-to-text API
- **Google Gemini AI** - Natural language processing
- **Multer** - File upload handling
- **Zod** - Schema validation

## 📡 API Endpoints

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
- `POST /api/voice/process` - Upload audio, transcribe with AssemblyAI, parse with Gemini

## 🎤 Using the Voice Feature

1. Click the floating microphone button in the bottom-right corner
2. Speak naturally: "Add 3 oranges, 10 bags of rice, and 2 chickens"
3. Click the button again to stop recording
4. Watch as your items are automatically added with intelligent categorization!

## 🗄️ Database Scripts

```bash
# Generate migration files
npm run db:generate

# Push schema to database (development)
npm run db:push

# Run migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🏗️ Building for Production

```bash
# Build the frontend
npm run build

# Start the production server
npm run start
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for various platforms.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [AssemblyAI](https://www.assemblyai.com/) for speech-to-text API
- [Google Gemini](https://ai.google.dev/) for natural language processing
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for database management

---

Made with ❤️ using React, TypeScript, and AI
