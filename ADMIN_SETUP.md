# Admin System Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Setup Admin Account
```
Visit: http://localhost:3000/admin/setup
Click: "Create Admin Account"
Save: The displayed credentials
```

### Step 2: Login
```
Visit: http://localhost:3000/login
Email: admin@bookingplatform.com
Password: Admin@12345
```

### Step 3: Manage Everything
```
Visit: http://localhost:3000/admin/dashboard
```

---

## 📌 Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@bookingplatform.com |
| **Password** | Admin@12345 |
| **Role** | admin |

> ⚠️ Change password after first login!

---

## 🎯 What Can Admin Do?

### View Complete Data
✅ All Users (Customers)  
✅ All Providers  
✅ All Services  
✅ All Bookings & Transactions  
✅ Platform Statistics & Revenue  

### Manage Everything
🗑️ Delete any Provider (+ all their services)  
🗑️ Delete any Service  
🗑️ Delete any Booking  
📊 View complete analytics  

---

## 📂 Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| Setup | `/admin/setup` | Create admin account |
| Dashboard | `/admin/dashboard` | Main admin panel |
| Users | (in dashboard) | Manage customers |
| Providers | (in dashboard) | Manage providers |
| Services | (in dashboard) | Manage services |
| Bookings | (in dashboard) | Manage transactions |

---

## 🔌 Admin APIs

All require: `Authorization: Bearer {TOKEN}`

```
GET  /api/admin/dashboard          - Statistics
GET  /api/admin/providers-list     - All providers
DELETE /api/admin/providers-list   - Remove provider
GET  /api/admin/services-list      - All services
DELETE /api/admin/services-list    - Remove service
GET  /api/admin/bookings-list      - All bookings
DELETE /api/admin/bookings-list    - Remove booking
GET  /api/admin/users              - All users
```

---

## 💡 Key Features

✨ **Dashboard Overview** - Real-time statistics  
✨ **Role-Based Access** - Only admins can access  
✨ **Full Data Visibility** - See everything happening  
✨ **Management Capabilities** - Delete/remove anything  
✨ **User Tracking** - Know who booked what, when  
✨ **Revenue Tracking** - Monitor all payments  

---

## 🔒 Security

- JWT token verification on all endpoints
- Admin role validation
- Password hashing with bcrypt
- Secure credential storage
- Audit-ready structure

---

## 📝 For Complete Guide
See: [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
