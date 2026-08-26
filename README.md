# BiogasCalc

Biogas Calculator Application built with the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local instance)
- [Docker](https://www.docker.com/) & Docker Compose (optional)

## Getting Started

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment

Copy the example env file in the backend:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MongoDB URI and desired port.

### 3. Run Development Server

```bash
npm run dev
```

This starts both the backend (port **5000**) and frontend (port **5173**) concurrently.

Or run them individually:

```bash
npm run dev:backend    # Express server only
npm run dev:frontend   # Vite dev server only
```

### 4. Run with Docker

```bash
docker-compose up --build
```

Services:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

## Project Structure

```
biogascalc/
├── backend/          # Express.js API server
│   ├── config/       # Database & app configuration
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Express middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   └── server.js     # Entry point
├── frontend/         # React + Vite client
│   └── src/
│       ├── api/      # Axios instance
│       ├── components/
│       └── pages/
├── docker-compose.yml
└── package.json      # Root scripts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Express.js 5, Node.js |
| Database | MongoDB, Mongoose |
| DevOps | Docker, Docker Compose |
