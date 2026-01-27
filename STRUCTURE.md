# Project Structure

```
booking-platform/
│
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes
│   │   ├── auth/                     # Authentication endpoints
│   │   │   ├── register/
│   │   │   │   └── route.ts          # POST - User registration
│   │   │   └── login/
│   │   │       └── route.ts          # POST - User login
│   │   │
│   │   ├── services/                 # Service management
│   │   │   ├── route.ts              # GET (all services), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE specific service
│   │   │
│   │   ├── bookings/                 # Booking management
│   │   │   ├── route.ts              # GET (role-based), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # PUT (update status), DELETE
│   │   │
│   │   └── admin/                    # Admin-only endpoints
│   │       └── users/
│   │           ├── route.ts          # GET all users
│   │           └── [id]/
│   │               └── route.ts      # PUT - Block/unblock user
│   │
│   ├── admin/                        # Admin pages
│   │   ├── users/
│   │   │   └── page.tsx              # User management interface
│   │   └── bookings/
│   │       └── page.tsx              # All bookings view
│   │
│   ├── provider/                     # Provider pages
│   │   ├── services/
│   │   │   └── page.tsx              # CRUD services interface
│   │   └── bookings/
│   │       └── page.tsx              # Accept/reject bookings
│   │
│   ├── bookings/
│   │   └── page.tsx                  # User bookings view
│   │
│   ├── services/
│   │   └── page.tsx                  # Public service listing
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Role-based dashboard
│   │
│   ├── register/
│   │   └── page.tsx                  # Registration form
│   │
│   ├── login/
│   │   └── page.tsx                  # Login form
│   │
│   ├── page.tsx                      # Home/landing page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
│
├── lib/                              # Utility libraries
│   ├── db.ts                         # MongoDB connection
│   └── middleware.ts                 # JWT auth middleware
│
├── models/                           # Mongoose schemas
│   ├── User.ts                       # User model
│   ├── Service.ts                    # Service model
│   └── Booking.ts                    # Booking model
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── next.config.js                    # Next.js config
├── global.d.ts                       # TypeScript global types
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
└── README.md                         # Setup documentation
```

## Key Files Explained

### Backend

**lib/db.ts**
- MongoDB connection with caching
- Handles connection reuse in serverless

**lib/middleware.ts**
- JWT verification
- Role-based access control
- Auth helpers: verifyAuth, requireAuth, requireRole

**models/***
- Mongoose schemas for User, Service, Booking
- Data validation and relationships

**app/api/***
- RESTful API endpoints
- Request validation
- Error handling

### Frontend

**app/page.tsx**
- Landing page
- Auth-aware navigation

**app/dashboard/page.tsx**
- Role-based navigation hub
- Links to relevant features per role

**app/services/page.tsx**
- Public service listing
- Booking modal for users

**app/bookings/page.tsx**
- User's booking history
- Status tracking

**app/provider/services/page.tsx**
- Provider's service CRUD
- Add/edit/delete modals

**app/provider/bookings/page.tsx**
- Booking requests management
- Accept/reject actions

**app/admin/users/page.tsx**
- User management table
- Block/unblock functionality

**app/admin/bookings/page.tsx**
- Complete booking overview
- All platform bookings

### Configuration

**package.json**
- All dependencies
- Build scripts

**tsconfig.json**
- TypeScript configuration
- Path aliases

**tailwind.config.js**
- Tailwind CSS setup
- Content paths

**.env**
- MONGODB_URI
- JWT_SECRET

## Data Flow

1. **Authentication**
   - User registers → POST /api/auth/register
   - User logs in → POST /api/auth/login → JWT token
   - Token stored in localStorage
   - Token sent in Authorization header for protected routes

2. **Service Management (Provider)**
   - Create → POST /api/services
   - Read → GET /api/services
   - Update → PUT /api/services/[id]
   - Delete → DELETE /api/services/[id]

3. **Booking Flow (User)**
   - Browse services → GET /api/services
   - Create booking → POST /api/bookings
   - View status → GET /api/bookings

4. **Booking Management (Provider)**
   - View requests → GET /api/bookings
   - Update status → PUT /api/bookings/[id]

5. **Admin Operations**
   - View users → GET /api/admin/users
   - Block user → PUT /api/admin/users/[id]
   - View all bookings → GET /api/bookings

## Authentication Flow

```
Client                    API Route              Middleware            Database
  |                          |                        |                    |
  |-- POST /api/auth/login ->|                        |                    |
  |                          |-- Hash comparison ---->|-- Query User ----->|
  |                          |<-- User data ----------|<-- User data ------|
  |<-- JWT token ------------|                        |                    |
  |                          |                        |                    |
  |-- Protected Request ---->|-- requireAuth() ------>|                    |
  |    (Bearer token)        |<-- AuthUser -----------|                    |
  |                          |-- requireRole() ------>|                    |
  |                          |<-- Access granted -----|                    |
  |<-- Protected data -------|                        |                    |
```

## Role-Based Access

### User
- View services (public)
- Create bookings
- View own bookings

### Provider
- CRUD own services
- View booking requests for own services
- Accept/reject bookings

### Admin
- View all users
- Block/unblock users
- View all bookings
- View all services
