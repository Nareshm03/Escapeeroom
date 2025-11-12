# Escape Room Team Management App

A full-stack web application built with React, Node.js/Express, and MongoDB (Atlas) for managing escape room teams.

## Features

- Simple user registration with email, password, and name
- Basic team creation
- Simple JWT authentication
- Basic login/register pages
- Responsive React frontend

## Project Structure

```
escape-room-app/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities and context
├── backend/           # Express.js API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── controllers/   # Route controllers
│   │   └── utils/         # Database and utilities
└── setup-db.js        # MongoDB setup and seeding
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas cluster (or local MongoDB)
- npm or yarn

### Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas cluster and user with appropriate permissions.
2. Add a connection string to `backend/.env`:
```
PORT=5000
JWT_SECRET=secret
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/escape-room-app?retryWrites=true&w=majority
```
3. Optionally run the setup script to initialize indexes and seed default settings:
```bash
node setup-db.js
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

### Running Both Servers

From the root directory:
```bash
npm run install:all
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams/:id/members` - Add team member

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/search` - Search users by email

## Basic Features

- Simple JWT authentication
- Basic user and team management
- Minimal validation
- **Sequential Puzzle Unlocking** 🔒
  - Progressive question unlocking based on correct answers
  - Configurable per quiz (enabled/disabled)
  - Visual progress indicators
  - Server-side validation
- **Comprehensive UI/UX Design System** ✨
  - Consistent visual design across all pages
  - Reusable components (Button, Card, Skeleton Loaders)
  - Smooth animations with Framer Motion
  - Toast notifications for user feedback
  - Global error boundary
  - Responsive 12-column grid system
  - Dark theme support

## Technologies Used

### Frontend
- React 18
- React Router
- Axios
- Framer Motion (animations)
- CSS3 with Design System

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Helmet
- CORS

## Development

The application runs on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Design System

View the comprehensive design system documentation:
- **Design System Page**: http://localhost:3000/design-system
- **Component Examples**: http://localhost:3000/component-example
- **Documentation**: See [UI_UX_README.md](UI_UX_README.md)
- **Quick Start**: See [DESIGN_SYSTEM_QUICK_START.md](DESIGN_SYSTEM_QUICK_START.md)

#### Key Features
- 12-column responsive grid system
- Standardized components (Button, Card, Skeleton Loaders)
- Design tokens (colors, spacing, typography)
- Smooth page transitions
- Toast notifications
- Global error handling
- Dark theme support
- Comprehensive documentation

## License

MIT License