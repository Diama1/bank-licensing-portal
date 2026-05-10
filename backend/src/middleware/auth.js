import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { serializeUser } from '../auth-strategies.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';

export const authenticateAccessToken = async (req, res, next) => {
  const authorization = req.get('authorization');
  const [scheme, token] = authorization?.split(' ') || [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    req.user = serializeUser(user);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token has expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    return next(error);
  }
};