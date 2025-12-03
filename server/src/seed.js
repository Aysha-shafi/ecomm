import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Category from './models/category.js';
import Product from './models/product.js';
import slugify from 'slugify';

import Coupon from './models/coupon.js';
import User from './models/user.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('connected');

  await Product.deleteMany({});
  await Category.deleteMany({});

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts', description: 'Soft cotton tees' },
    { name: 'Hats', slug: 'hats', description: 'Cool hats' },
    { name: 'Accessories', slug: 'accessories', description: 'Add-ons' }
  ];

  const created = await Category.insertMany(categories);
  console.log('categories created', created.length);

  const products = [];
  for (let i = 1; i <= 12; i++) {
    const c = created[i % created.length];
    products.push({
      name: `Product ${i}`,
      slug: slugify(`Product ${i}`),
      description: `Description for product ${i}`,
      price: Math.round(Math.random() * 100) + 10,
      sku: `SKU-${i}`,
      category: c._id,
      images: [],
      inventory: { stock: Math.round(Math.random() * 30) + 1 }
    });
  }
  await Product.insertMany(products);
  console.log('products created');

  // sample coupons
  await Coupon.deleteMany({});
  await Coupon.insertMany([
    { code: 'SUMMER10', discountType: 'percent', value: 10, active: true },
    { code: 'SAVE5', discountType: 'fixed', value: 5, active: true }
  ]);
  console.log('coupons created');

  // admin user
  await User.deleteMany({});
  const adminPass = process.env.ADMIN_PASSWORD || 'password';
  const adminHash = await bcrypt.hash(adminPass, 10);

  await User.create({
    email: 'admin@example.com',
    passwordHash: adminHash,
    isAdmin: true
  });

  console.log(
    'admin user created: admin@example.com (password from .env or default: password)'
  );

  mongoose.disconnect();
}

seed().catch(err => console.error(err));
