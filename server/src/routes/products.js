import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import Product from '../models/product.js';
import Category from '../models/category.js';

const router = express.Router();

// GET list with pagination + category filter + search
router.get('/', async (req, res) => {
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

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    data: products
  });
});

// GET single by slug
router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    'category'
  );
  if (!product) return res.status(404).json({ message: 'Not found' });

  res.json(product);
});

// POST create
router.post(
  '/',
  authMiddleware,
  adminOnly,
  body('name').isLength({ min: 1 }).withMessage('Name required'),
  body('sku').isLength({ min: 1 }).withMessage('SKU is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const payload = req.body;

    if (!payload.slug)
      payload.slug = slugify(payload.name || '', { lower: true });

    try {
      if (payload.category) {
        const ok = await Category.exists({ _id: payload.category });
        if (!ok)
          return res.status(400).json({ message: 'Invalid category' });
      }

      const product = new Product(payload);
      await product.save();

      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// PUT update
router.put(
  '/:id',
  authMiddleware,
  adminOnly,
  body('name')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Name must not be empty'),
  body('sku')
    .optional()
    .isLength({ min: 1 })
    .withMessage('SKU is required'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const payload = req.body;

    if (payload.name && !payload.slug)
      payload.slug = slugify(payload.name, { lower: true });

    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        payload,
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// DELETE
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
