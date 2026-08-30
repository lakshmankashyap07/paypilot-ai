import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import { categoriesData, productsData } from './seed/productsData.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Demo Customer',
    email: 'customer@paypilot.demo',
    password: 'DemoCustomer123!',
    phone: '9876543210',
    role: 'CUSTOMER'
  },
  {
    name: 'Demo Merchant',
    email: 'merchant@paypilot.demo',
    password: 'DemoMerchant123!',
    phone: '9876543211',
    role: 'MERCHANT'
  },
  {
    name: 'Demo Admin',
    email: 'admin@paypilot.demo',
    password: 'DemoAdmin123!',
    phone: '9876543212',
    role: 'ADMIN'
  }
];

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/paypilot_db';

  try {
    console.log(`[Seed] Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB successfully.');

    // 1. Seed Demo Users & get Merchant User ID
    console.log('[Seed] Seeding demo users...');
    let merchantUser = null;
    for (const demoUser of demoUsers) {
      let existingUser = await User.findOne({ email: demoUser.email });
      if (existingUser) {
        existingUser.name = demoUser.name;
        existingUser.password = demoUser.password;
        existingUser.phone = demoUser.phone;
        existingUser.role = demoUser.role;
        existingUser.isActive = true;
        await existingUser.save();
        if (demoUser.role === 'MERCHANT') merchantUser = existingUser;
      } else {
        const created = await User.create(demoUser);
        if (demoUser.role === 'MERCHANT') merchantUser = created;
      }
    }
    console.log('✅ Demo users seeded successfully.');

    // 2. Seed Categories
    console.log('[Seed] Seeding categories...');
    for (const catData of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: catData.slug },
        catData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ ${categoriesData.length} categories seeded successfully.`);

    // 3. Seed Products assigned to Demo Merchant
    console.log('[Seed] Seeding products...');
    let productCount = 0;
    for (const prodData of productsData) {
      const productPayload = {
        ...prodData,
        merchant: merchantUser ? merchantUser._id : undefined
      };
      await Product.findOneAndUpdate(
        { sku: prodData.sku },
        productPayload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      productCount++;
    }
    console.log(`✅ ${productCount} products seeded successfully across 10 categories.`);

    console.log('=================================');
    console.log('🎉 PAYPILOT AI SEED COMPLETED!');
    console.log('=================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.warn(`[Seed Error] Could not complete database seed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
