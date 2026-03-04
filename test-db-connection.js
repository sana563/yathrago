// Test MongoDB Connection Script
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/travel', {
      dbName: 'travel_users',
    });
    console.log('✅ MongoDB connection successful!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // Create a test user schema
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
    });
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Check if users collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', ') || 'None yet');
    
    // Count users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
