# Issue Tracker API (Backend)

A secure, full-featured backend for an issue tracking system built with **Node.js + Express + TypeScript**.

## Features

- JWT Authentication & Role-Based Access (User/Admin)
- RESTful API with Swagger Documentation
- Background Jobs (Email Notifications via BullMQ + Redis)
- Transactional Emails (Resend)
- Rate Limiting & Logging
- Docker Ready

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: MongoDB (Atlas)
- **Cache/Queue**: Redis (Upstash or Redis Cloud)
- **Background Jobs**: BullMQ
- **Email**: [Resend](https://resend.com)
- **Docs**: Swagger UI (OpenAPI)
- **Hosting**: Render / Docker

## rerequisites

- [Node.js](https://nodejs.org) (v18+)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (free tier)
- [Upstash Redis](https://upstash.com) or [Redis Cloud](https://redis.com/try-free/) (free tier)
- [Resend Account](https://resend.com) (free 3,000 emails/month)

## Setup & Installation

```bash
git clone https://github.com/washington786/api.git
cd api/backend
npm install

### ENVIRONMENT VARIABLES
PORT=5000
NODE_ENV=development
JWT_SECRET=your_strong_jwt_secret_here
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/issue-tracker
REDIS_URL=your-redis-host.upstash.io
REDIS_PORT=16879
REDIS_USERNAME=default
REDIS_PASSWORD=your_long_password_here
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX
API_BASE_PATH=/api

## Security
Passwords hashed with bcrypt
JWT with 7-day expiry
Rate limiting on auth routes
Input validation
Environment variables for secrets

### DEVELOPMENT
npm run dev

### PRODUCTION
npm run build
npm start

### PROJECT STRUCTURE
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── routes/          # API routes
│   ├── models/          # Mongoose schemas
│   ├── utils/           # Helpers (logger, email, swagger)
│   ├── middlewares/     # Auth, rate limit
│   ├── configs/         # DB, Redis
│   └── server.ts        # Entry point
├── dist/                # Compiled JS
├── .env.example
├── package.json
├── tsconfig.json
└── docker-compose.yml
