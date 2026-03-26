# ParkIt - Advanced Parking Management System

ParkIt is a comprehensive parking management solution designed to streamline the parking process for users, drivers, and administrators. It features a robust backend for managing parking areas, tickets, and driver assignments, combined with an intuitive frontend for various user roles.

## Technology Stack

### Frontend
- Framework: React
- Build Tool: Vite
- Styling: CSS
- State Management: Local React State
- Routing: React Router (inferred)
- Linting: ESLint

### Backend
- Runtime: Node.js
- Framework: Express
- Database: PostgreSQL (via Prisma ORM)
- Authentication: JSON Web Tokens (JWT) and Bcrypt for password hashing
- Tools: Prisma Client, Prisma CLI

## Project Structure

- /backend: Contains the server-side logic, API routes, and database models.
- /frontend: Contains the client-side application and UI components.
- /backend/prisma: Database schema and migrations.
- /backend/src: Backend source code including controllers and routes.
- /frontend/src: Frontend source code including components and layout.

## Key Features by Role

### SuperAdmin
- Overall system management.
- User and role administration.
- Monitoring system performance and logs.

### Manager
- Create and manage parking areas.
- Monitor active tickets and driver assignments within their area.
- View parking area statistics and performance.

### Driver
- Manage availability status (Available, Busy, Inactive).
- Receive and process parking and retrieval requests.
- Track assigned tickets and their current status.

### User
- Register and manage personal profile.
- Add and manage multiple cars.
- Request parking and retrieval tickets.
- View ticket history and current status.

## Setup and Installation

### Prerequisites
- Node.js (v18 or later recommended)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   cd backend
2. Install dependencies:
   npm install
3. Configure environment variables:
   Create a .env file based on the provided .env.example (if available) and set your DATABASE_URL and JWT_SECRET.
4. Generate Prisma client:
   npx prisma generate
5. Run database migrations:
   npx prisma migrate dev
6. Start the server:
   npm start

### Frontend Setup
1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install
3. Configure environment variables:
   Create a .env file and set your VITE_API_BASE_URL.
4. Start the development server:
   npm run dev

## License
This project is licensed under the ISC License.
