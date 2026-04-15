import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const checkUsers = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected successfully');

    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`- Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`);
    });

    if (users.length === 0) {
      console.log('No users found. Creating a default admin...');
      const admin = await User.create({
        name: 'System Admin',
        username: 'admin',
        email: 'admin@school.com',
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('Created default admin: admin / adminpassword123');
    } else {
        // Find admin and reset password to something known if it exists
        const admin = users.find(u => u.role === 'admin' || u.username === 'admin');
        if (admin) {
            admin.password = 'adminpassword123';
            await admin.save();
            console.log(`Updated admin (${admin.username}) password to: adminpassword123`);
        }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
