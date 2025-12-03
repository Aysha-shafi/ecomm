import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    passwordHash,
    isAdmin: !!isAdmin
  });

  await user.save();

  const token = jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
      email: user.email
    },
    process.env.JWT_SECRET || 'change_this_secret',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, isAdmin: user.isAdmin }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
      email: user.email
    },
    process.env.JWT_SECRET || 'change_this_secret',
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user._id, email: user.email, isAdmin: user.isAdmin }
  });
});

export default router;
