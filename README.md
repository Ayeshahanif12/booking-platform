# Booking Platform - Full Stack Application

Production-ready client-service booking platform built with Next.js, MongoDB, and JWT authentication.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken, bcryptjs)
- **Deployment**: Vercel-ready

## Features

### User Roles
- **User**: Browse and book services
- **Provider**: Manage services and booking requests
- **Admin**: Manage users and view all bookings

### Authentication
- Signup/Login with role selection
- JWT token-based authentication
- Protected routes with middleware
- Account blocking functionality

### User Features
- View all available services
- Book services with date and time
- View booking status (pending/accepted/rejected)

### Provider Features
- CRUD operations on services
- View booking requests
- Accept or reject bookings

### Admin Features
- View all users
- Block/unblock providers and users
- View all bookings across platform

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file in root:
```env
MONGODB_URI=mongodb://localhost:27017/booking-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booking-platform
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Deployment to Vercel

### One-Click Deploy
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy

### Manual Deploy
```bash
npm install -g vercel
vercel
```

Follow prompts and add environment variables in Vercel dashboard.

## Project Structure

```
booking-platform/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── login/route.ts
│   │   ├── services/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── admin/
│   │       └── users/
│   │           ├── route.ts
│   │           └── [id]/route.ts
│   ├── admin/
│   │   ├── users/page.tsx
│   │   └── bookings/page.tsx
│   ├── provider/
│   │   ├── services/page.tsx
│   │   └── bookings/page.tsx
│   ├── bookings/page.tsx
│   ├── services/page.tsx
│   ├── dashboard/page.tsx
│   ├── register/page.tsx
│   ├── login/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── db.ts
│   └── middleware.ts
├── models/
│   ├── User.ts
│   ├── Service.ts
│   └── Booking.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Database Schemas

### User
```typescript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'provider' | 'admin',
  isBlocked: Boolean,
  timestamps: true
}
```

### Service
```typescript
{
  title: String,
  description: String,
  price: Number,
  providerId: ObjectId (ref: User),
  timestamps: true
}
```

### Booking
```typescript
{
  userId: ObjectId (ref: User),
  serviceId: ObjectId (ref: Service),
  date: Date,
  time: String,
  status: 'pending' | 'accepted' | 'rejected',
  timestamps: true
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - Get all services (optional ?providerId)
- `POST /api/services` - Create service (Provider/Admin)
- `GET /api/services/[id]` - Get service by ID
- `PUT /api/services/[id]` - Update service (Provider/Admin)
- `DELETE /api/services/[id]` - Delete service (Provider/Admin)

### Bookings
- `GET /api/bookings` - Get bookings (role-based filtering)
- `POST /api/bookings` - Create booking (User)
- `PUT /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings/[id]` - Delete booking

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/[id]` - Block/unblock user (Admin)

## Default Test Accounts

After deployment, create accounts via `/register`:

**Admin**
- Email: admin@test.com
- Password: admin123
- Role: Admin

**Provider**
- Email: provider@test.com
- Password: provider123
- Role: Provider

**User**
- Email: user@test.com
- Password: user123
- Role: User

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes with middleware
- Role-based access control
- Account blocking capability

## License

MIT
