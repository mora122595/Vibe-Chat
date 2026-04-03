[README.md](https://github.com/user-attachments/files/26473630/README.md)
# VibeChat 💬

A real-time full-stack chat application with friend management, live notifications, and message delivery tracking.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)

## Features

- 🔐 JWT authentication with secure httpOnly cookies
- 💬 Real-time messaging with Socket.io
- 📨 Message delivery status (sent → delivered → read)
- 🔔 Persistent unread message notifications — survive page refresh
- 👥 Friend system (send, accept, decline, remove requests)
- 🖼️ Image sharing with Cloudinary optimization
- ✍️ Live typing indicators
- 🌐 Online/offline presence
- 📜 Paginated chat history with infinite scroll
- 🎨 Multiple themes via DaisyUI
- 🛡️ Error tracking with Sentry

## Tech Stack

**Frontend**
- React + Vite
- Zustand (state management)
- Socket.io Client
- Axios
- TailwindCSS + DaisyUI
- Sentry

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- Cloudinary
- JWT + bcryptjs

## Project Structure

```
vibechat/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── message.controller.js
│       │   └── friends.controller.js
│       ├── lib/
│       │   ├── db.js
│       │   ├── socket.js
│       │   ├── cloudinary.js
│       │   └── utils.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── user.model.js
│       │   └── message.model.js
│       ├── routes/
│       │   ├── auth.route.js
│       │   ├── message.route.js
│       │   └── friends.route.js
│       └── index.js
└── frontend/
    └── src/
        ├── components/
        │   ├── ChatWindow.jsx
        │   ├── ChatMessage.jsx
        │   ├── SideBar.jsx
        │   ├── NavBar.jsx
        │   └── ErrorBoundary.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── SignUpPage.jsx
        │   └── ProfilePage.jsx
        ├── stores/
        │   ├── UseAuthStore.js
        │   ├── UseChatStore.js
        │   └── UseFriendsStore.js
        └── lib/
            ├── axios.js
            └── helpers.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Sentry account (optional)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vibechat.git
cd vibechat
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Run the app

**Backend** (from the `backend` directory):
```bash
npm run dev
```

**Frontend** (from the `frontend` directory):
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| PUT | `/api/auth/update-profile` | Update profile |
| GET | `/api/auth/check-auth` | Verify session |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/message/users` | Get all users |
| GET | `/api/message/conversation/:id` | Get paginated chat history |
| POST | `/api/message/send/:id` | Send a message |
| GET | `/api/message/unread` | Get unread message counts |

### Friends
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/friends/list` | Get friends list |
| GET | `/api/friends/requests` | Get friend requests |
| GET | `/api/friends/pending-requests` | Get pending requests |
| POST | `/api/friends/request/:id` | Send friend request |
| PATCH | `/api/friends/accept/:id` | Accept friend request |
| PATCH | `/api/friends/decline/:id` | Decline friend request |
| DELETE | `/api/friends/unfriend/:id` | Remove friend |
| DELETE | `/api/friends/remove-request/:id` | Cancel sent request |

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `newMessage` | Server → Client | New message received |
| `messageRead` | Bidirectional | Messages marked as read |
| `messageDelivered` | Bidirectional | Messages marked as delivered |
| `typing` | Bidirectional | User is typing |
| `stopTyping` | Bidirectional | User stopped typing |
| `newRequest` | Server → Client | New friend request received |
| `onlineUsers` | Server → Client | Online users list updated |

## Deployment

The app is configured for production with the backend serving the frontend static files.

```bash
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && NODE_ENV=production npm start
```
