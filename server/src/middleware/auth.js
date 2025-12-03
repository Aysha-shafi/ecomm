import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing auth token' });

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token)
    return res.status(401).json({ message: 'Invalid auth header' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Requires admin' });
  next();
}
