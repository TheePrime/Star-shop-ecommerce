import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../src/Models/admin.model.js'
import bcrypt from 'bcrypt'

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if superAdmin already exists
    const existing = await Admin.findOne({ role: 'superAdmin' });
    if (existing) {
      console.log('❌ SuperAdmin already exists');
      process.exit(0);
    }

    // Create superAdmin
    const hashedPassword = await bcrypt.hash('SuperSecret123!', 10);

    const superAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'super@admin.com',
      password: hashedPassword,
      role: 'superAdmin',
    });

    console.log('✅ SuperAdmin created:', superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding superAdmin:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();