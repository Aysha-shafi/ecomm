import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import categoriesRouter from './src/routes/categories.js';
import productsRouter from './src/routes/products.js';
import uploadsRouter from './src/routes/uploads.js';
import couponsRouter from './src/routes/coupons.js';
import authRouter from './src/routes/auth.js';

import { authMiddleware, adminOnly } from './src/middleware/auth.js';

import Product from './src/models/product.js';
import Category from './src/models/category.js';
import Coupon from './src/models/coupon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/auth', authRouter);

app.get('/api/admin/summary', authMiddleware, adminOnly, async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalCoupons = await Coupon.countDocuments();
  const totalActiveCoupons = await Coupon.countDocuments({
    active: true,
    $or: [ { expiresAt: null }, { expiresAt: { $gt: new Date() } } ]
  });
  const lowStock = await Product.find({ 'inventory.stock': { $lte: 5 } }).limit(10);

  console.log('Admin summary counts:', { 
    totalProducts, 
    totalCategories, 
    totalCoupons, 
    totalActiveCoupons, 
    lowStockCount: lowStock.length 
  });

  res.json({ 
    totalProducts, 
    totalCategories, 
    totalCoupons, 
    totalActiveCoupons, 
    lowStock 
  });
});

app.get('/api/public/products', async (req, res) => {
  const { page = 1, limit = 12, category, q } = req.query;
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (q) filter.name = new RegExp(q, 'i');

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate('category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt')
  ]);

  res.json({ total, page: Number(page), limit: Number(limit), data: products });
});

app.get('/api/public/products/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

app.post('/api/public/coupons/validate', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.active) {
    return res.status(200).json({ valid: false, message: 'Invalid coupon' });
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return res.status(200).json({ valid: false, message: 'Coupon expired' });
  }

  res.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value
    }
  });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server started on port', PORT));
  })
  .catch(err => {
    console.error('DB connection error', err);
  });

export default app;
