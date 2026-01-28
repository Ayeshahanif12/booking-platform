# Admin Panel Setup & Guide

## 🔐 Admin Credentials

**Email:** `admin@bookingplatform.com`  
**Password:** `Admin@12345`

> ⚠️ **IMPORTANT:** Change the password immediately after your first login!

---

## 📋 Setup Instructions

### Step 1: Create Admin Account
1. Visit: `http://localhost:3000/admin/setup`
2. Click "Create Admin Account" button
3. Save the credentials displayed
4. The system will confirm if admin already exists (that's fine!)

### Step 2: Login to Admin Dashboard
1. Go to: `http://localhost:3000/login`
2. Enter email: `admin@bookingplatform.com`
3. Enter password: `Admin@12345`
4. You'll be redirected to the admin dashboard

---

## 🎯 Admin Dashboard Features

### Overview Tab
- **Total Users:** Count of all customers
- **Total Providers:** Count of all service providers
- **Total Services:** Count of all available services
- **Total Bookings:** Total transactions
- **Completed Bookings:** Successfully completed services
- **Pending Bookings:** Awaiting completion
- **Total Revenue:** Sum of all paid bookings

### Providers Tab
View all providers with detailed stats:
- ✅ Total services per provider
- ✅ Total bookings received
- ✅ Completed bookings count
- ✅ Total earnings
- ✅ Average rating
- 🗑️ Delete button to remove provider (also deletes all their services)

### Users Tab
View all customers:
- ✅ User names and emails
- ✅ Joined date
- ✅ Account status

### Services Tab
View all services:
- ✅ Service title and description
- ✅ Provider name
- ✅ Category
- ✅ Price and rating
- 🗑️ Delete button to remove service

### Bookings Tab
View all transactions:
- ✅ Customer and provider names
- ✅ Service name
- ✅ Booking status (pending, accepted, completed, cancelled)
- ✅ Payment status (paid, unpaid)
- ✅ Booking date and price
- 🗑️ Delete button to remove booking

---

## 🔑 API Endpoints (Admin Only)

All endpoints require `Authorization: Bearer {TOKEN}` header

### Dashboard Statistics
```
GET /api/admin/dashboard
Response: {
  statistics: {
    totalUsers: number,
    totalProviders: number,
    totalServices: number,
    totalBookings: number,
    completedBookings: number,
    pendingBookings: number,
    totalRevenue: number
  }
}
```

### Get All Providers
```
GET /api/admin/providers-list
Response: {
  providers: [...],
  total: number
}
```

### Delete Provider (including all services)
```
DELETE /api/admin/providers-list
Body: { providerId: "..." }
Response: { message: "...", deletedData: {...} }
```

### Get All Services
```
GET /api/admin/services-list
Response: {
  services: [...],
  total: number
}
```

### Delete Service
```
DELETE /api/admin/services-list
Body: { serviceId: "..." }
Response: { message: "...", service: {...} }
```

### Get All Bookings
```
GET /api/admin/bookings-list
Response: {
  bookings: [...],
  total: number
}
```

### Delete Booking
```
DELETE /api/admin/bookings-list
Body: { bookingId: "..." }
Response: { message: "...", booking: {...} }
```

### Get All Users
```
GET /api/admin/users
Response: {
  users: [...]
}
```

---

## 🛡️ Security Features

✅ **JWT Token Validation** - All endpoints verify admin token  
✅ **Role-Based Access Control** - Only admin role can access admin endpoints  
✅ **Data Validation** - All inputs validated before processing  
✅ **Cascading Deletes** - Deleting provider removes all their services and bookings  

---

## 🚀 Usage Examples

### Fetch Dashboard Stats
```javascript
const token = localStorage.getItem('token');
const res = await fetch('/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await res.json();
console.log(data.statistics);
```

### Delete a Provider
```javascript
const token = localStorage.getItem('token');
const res = await fetch('/api/admin/providers-list', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ providerId: '...' })
});
const data = await res.json();
```

---

## 📊 Data Visibility

As an admin, you have **complete visibility** of:

- **All Users:** Customer accounts, emails, joining dates
- **All Providers:** Service providers, their services, earnings, ratings
- **All Services:** Service details, pricing, availability, ratings
- **All Bookings:** Customer bookings, dates, status, payments
- **Financial Data:** Total revenue, payment status per transaction

---

## ⚠️ Important Notes

1. **Password Change:** Update admin password after setup
2. **Data Deletion:** Deleting providers/services/bookings cannot be undone
3. **Multiple Admins:** Can create more admin accounts by modifying the setup endpoint
4. **Token Expiry:** Admin sessions expire per your JWT configuration
5. **Audit Trail:** Consider adding admin action logging for security

---

## 🆘 Troubleshooting

### Admin not logging in?
- Verify email: `admin@bookingplatform.com`
- Verify password: `Admin@12345`
- Clear browser cache and try again

### Can't see any data?
- Ensure you're logged in as admin (check localStorage user.role)
- Check API endpoints are returning data
- Verify token is valid

### Delete not working?
- Confirm you're logged in as admin
- Check browser console for errors
- Verify the ID exists in database

---

**Version:** 1.0  
**Last Updated:** January 2026
