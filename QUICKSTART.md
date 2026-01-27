# Quick Start Guide

## Setup (5 minutes)

```bash
cd booking-platform
npm install
```

Create `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/booking-platform
JWT_SECRET=my-super-secret-key-12345
```

```bash
npm run dev
```

Open `http://localhost:3000`

## Test Flow

### 1. Register Provider
- Go to `/register`
- Email: provider@test.com
- Password: test123
- Role: Provider
- Click Register

### 2. Register User
- Go to `/register`
- Email: user@test.com
- Password: test123
- Role: User
- Click Register

### 3. Provider: Create Service
- Login as provider
- Dashboard → My Services
- Add Service
- Title: "Web Development"
- Description: "Full stack development services"
- Price: 100
- Save

### 4. User: Book Service
- Login as user
- Browse Services
- Book "Web Development"
- Select date and time
- Confirm

### 5. Provider: Manage Booking
- Login as provider
- Dashboard → Booking Requests
- Accept or Reject

### 6. Admin: Manage Users
- Register admin account (role: Admin)
- Dashboard → Manage Users
- Block/Unblock users

## Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create booking-platform --public --source=. --push
```

Vercel:
1. Import repository
2. Add environment variables
3. Deploy

Done!
