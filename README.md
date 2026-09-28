# Todo List Application

A full-stack Todo List application built with Next.js (Frontend) and Node.js/Express (Backend) using PostgreSQL as the database.

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** Next.js
- **Styling:** CSS / PostCSS
- **State Management & Data Fetching:** React Hooks

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (pg)
- **Authentication:** JWT (JSON Web Tokens)

## 📂 Project Structure

```
.
├── client/                 # Next.js frontend application
│   ├── public/             # Static assets
│   └── src/                # Frontend source code (app, components, services)
├── server/                 # Node.js backend application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middlewares (auth, roles)
│   ├── models/             # Database models/queries
│   ├── routes/             # API routes
│   └── services/           # Business logic
└── README.md
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (installed and running)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/sjinay21/todolist.git
cd todolist
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your environment variables (e.g., Database URI, JWT Secret):
```env
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todolist
JWT_SECRET=your_jwt_secret
```

### 3. Setup the Frontend (Client)
Open a new terminal window and navigate to the client folder:
```bash
cd client
npm install
```
Create a `.env.local` file in the `client` directory (if needed) for any frontend environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

**Run the Backend:**
```bash
cd server
npm start
# or npm run dev (if nodemon is configured)
```
The server will start on `http://localhost:5000`

**Run the Frontend:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:3000`

## 👥 Authors
- [sjinay21](https://github.com/sjinay21)
