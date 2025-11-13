# 🎯 Escape Room Team Management App

A full-stack web application for managing escape room teams with interactive quizzes, sequential puzzle unlocking, and real-time collaboration features.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Team Management** - Create and manage escape room teams
- 📝 **Interactive Quizzes** - Build custom quizzes with multiple question types
- 🔒 **Sequential Puzzle Unlocking** - Progressive question unlocking based on correct answers
- 📊 **Real-time Progress Tracking** - Monitor team performance and quiz completion
- 🎨 **Comprehensive Design System** - Consistent UI/UX across all pages

### UI/UX Highlights
- ⚡ Smooth animations with Framer Motion
- 🎨 Reusable component library (Button, Card, Skeleton Loaders)
- 📱 Responsive 12-column grid system
- 🌙 Dark theme support
- 🔔 Toast notifications for user feedback
- 🛡️ Global error boundary
- ♿ Accessibility compliant

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/escape-room-app.git
cd escape-room-app
```

2. **Set up environment variables**

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/escape-room-app?retryWrites=true&w=majority
NODE_ENV=development
```

3. **Install dependencies and run**
```bash
# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Run both servers concurrently
cd ..
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
escape-room-app/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utilities and context
│   │   └── styles/          # Global styles and design tokens
│   └── package.json
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── routes/          # API route definitions
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose schemas
│   │   └── utils/           # Database and utilities
│   └── package.json
│
├── api/                     # Vercel serverless functions
│   └── index.js
│
├── setup-db.js              # Database initialization script
├── vercel.json              # Vercel deployment config
└── package.json             # Root package configuration
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get user's teams |
| POST | `/api/teams` | Create new team |
| GET | `/api/teams/:id` | Get team details |
| GET | `/api/teams/:id/members` | Get team members |
| POST | `/api/teams/:id/members` | Add team member |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz` | Get all quizzes |
| POST | `/api/quiz` | Create new quiz |
| POST | `/api/quiz/start` | Start secure quiz session (requires auth) |
| GET | `/api/quiz/:id` | Get quiz details |
| POST | `/api/quiz/:id/submit` | Submit quiz answers |
| GET | `/api/quiz/:id/results` | Get quiz results |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/users/search` | Search users by email |

## 🔐 Quiz Session Management

Secure quiz sessions with JWT-based authentication:

- **Session Tracking** - Unique UUID for each quiz attempt
- **JWT Tokens** - 3-hour expiration for quiz access
- **Authentication** - User verification before quiz start
- **Database Persistence** - All sessions stored and tracked

For detailed documentation, see:
- [Quiz Session API Documentation](QUIZ_SESSION_API.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [Quick Start Guide](QUICK_START_QUIZ_SESSION.md)

### Start a Quiz Session

```javascript
// 1. Login to get auth token
const loginRes = await axios.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// 2. Start quiz session
const startRes = await axios.post(
  '/api/quiz/start',
  { quizId: '507f1f77bcf86cd799439011' },
  { headers: { Authorization: `Bearer ${loginRes.data.token}` } }
);

// 3. Redirect to secure quiz
window.location.href = startRes.data.startUrl;
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **CSS3** - Styling with custom design system

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### DevOps
- **Vercel** - Deployment platform
- **Nodemon** - Development server
- **ESLint** - Code linting

## 🎨 Design System

Access the comprehensive design system documentation at:
- **Design System Page**: http://localhost:3000/design-system
- **Component Examples**: http://localhost:3000/component-example

### Key Components
- **Button** - Primary, secondary, danger variants with loading states
- **Card** - Flexible container with hover effects
- **Skeleton Loaders** - Loading placeholders
- **Toast Notifications** - User feedback system
- **Grid System** - 12-column responsive layout

For detailed documentation, see:
- [UI/UX Documentation](UI_UX_README.md)
- [Design System Quick Start](DESIGN_SYSTEM_QUICK_START.md)

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Vercel auto-detects configuration from `vercel.json`

3. **Add Environment Variables**
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

4. **Deploy**
- Click "Deploy" and wait for build completion
- Your app will be live at `https://your-app.vercel.app`

For detailed deployment instructions, see [VERCEL_SETUP_COMPLETE.md](VERCEL_SETUP_COMPLETE.md)

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Test API endpoints
curl http://localhost:5000/api/health

# Test deployment
VERCEL_URL=https://your-app.vercel.app node test-deployment.js
```

## 📝 Database Setup

Initialize MongoDB with indexes and seed data:

```bash
node setup-db.js
```

This script:
- Creates necessary indexes for performance
- Sets up default collections
- Seeds initial configuration data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the cloud database solution
- Vercel for seamless deployment
- Framer Motion for smooth animations

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

**Made with ❤️ for escape room enthusiasts**
