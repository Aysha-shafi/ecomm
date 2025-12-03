import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import Category from '../models/category.js';
import slugify from 'slugify';

const router = express.Router();

// GET list
router.get('/', async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
});

// GET single
router.get('/:id', async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
});

// POST create
router.post(
  '/',
  authMiddleware,
  adminOnly,
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, description, slug } = req.body;
    const s = slug || slugify(name, { lower: true });

    try {
      const category = new Category({ name, description, slug: s });
      await category.save();
      res.status(201).json(category);
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
  body('name').optional().isLength({ min: 1 }).withMessage('Name must not be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, description, slug } = req.body;
    const s = slug || slugify(name || '', { lower: true });

    try {
      const updated = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description, slug: s },
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
  await Category.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
