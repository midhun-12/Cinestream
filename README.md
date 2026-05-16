# 🎬 Cinestream

A full-stack movie streaming application built with modern web technologies. Cinestream provides a seamless experience for users to discover, stream, and manage their favorite movies.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Statistics](#project-statistics)
- [Demo & Documentation](#demo--documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Movie Catalog**: Browse and search through a collection of movies
- **Streaming**: Watch movies with a built-in video player
- **User Profiles**: Manage user information and preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive user interface built with React

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.5) - UI library
- **Vite** (v8.0.9) - Build tool for fast development
- **React Router** (v7.14.1) - Client-side routing
- **Axios** (v1.15.1) - HTTP client for API calls
- **Lucide React** (v1.8.0) - Icon library
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v5.2.1) - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** (jsonwebtoken v9.0.3) - Authentication
- **Bcryptjs** (v3.0.3) - Password hashing
- **CORS** (v2.8.6) - Cross-origin resource sharing

### Language Composition
- **JavaScript**: 93.9%
- **CSS**: 5.7%
- **HTML**: 0.4%

## 📁 Project Structure

```
Cinestream/
├── frontend/              # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/               # Node.js Express backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 📦 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/midhun-12/Cinestream.git
cd Cinestream
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create a .env file with the following variables
cp .env.example .env

# Edit .env and add your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🎯 Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
# Application will be available at http://localhost:5173
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Movie Endpoints
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Add new movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/watchlist` - Get user's watchlist

## 📊 Project Statistics

| Language | Percentage |
|----------|-----------|
| JavaScript | 93.9% |
| CSS | 5.7% |
| HTML | 0.4% |

## 🎥 Demo & Documentation

### 📹 Demo Video
<!-- Add your demo video link below -->
**[Click here to watch the demo video](#)**

> Replace `#` with your demo video URL (YouTube, Vimeo, or any video hosting platform)

### 📖 Code Explanation
<!-- Add your code explanation/documentation link below -->
**[Read detailed code explanation](#)**

> Replace `#` with your documentation URL (Blog post, Wiki, or detailed guide)

### Other Resources
- **[Live Demo](#)** - See the application in action
- **[API Documentation](#)** - Comprehensive API reference
- **[Developer Guide](#)** - Setup and development instructions
- **[Troubleshooting](#)** - Common issues and solutions

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Author**: [midhun-12](https://github.com/midhun-12)

**Last Updated**: May 16, 2026

For questions or support, please open an issue on GitHub.
