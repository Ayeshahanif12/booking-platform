// Test MongoDB Connection
// Run with: node test-mongo.js

const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS for resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ayeshahanif0317_db_user:13MC80qUhoNIZxsw@cluster0.jiwaaok.mongodb.net/bookingplatform?retryWrites=true&w=majority';

console.log('🔄 Testing MongoDB Connection...');
console.log('URI:', mongoUri.substring(0, 50) + '...');

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Connection Error:');
    console.error('Error Type:', err.name);
    console.error('Error Message:', err.message);
    console.error('Full Error:', err);
  });
