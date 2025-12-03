import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import Coupon from '../models/coupon.js';

const router = express.Router();

// list
router.get('/', async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json(coupons);
});

// create
router.post(
  '/',
  authMiddleware,
  adminOnly,
  body('code').isLength({ min: 2 }).withMessage('Code required'),
  body('discountType').isIn(['percent', 'fixed']).withMessage('Invalid type'),
  body('value').isFloat({ gt: 0 }).withMessage('Value must be > 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      if (req.body.code) req.body.code = req.body.code.toUpperCase();
      const c = await Coupon.create(req.body);
      res.status(201).json(c);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// update
router.put(
  '/:id',
  authMiddleware,
  adminOnly,
  body('code').optional().isLength({ min: 2 }).withMessage('Code required'),
  body('discountType').optional().isIn(['percent', 'fixed']).withMessage('Invalid type'),
  body('value').optional().isFloat({ gt: 0 }).withMessage('Value must be > 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const updated = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  }
);

// delete
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
