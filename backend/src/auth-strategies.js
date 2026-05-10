import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from './lib/prisma.js';

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';


export const serializeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createAccessToken = (user) => jwt.sign(
  {
    sub: user.id,
    email: user.email,
    role: user.role,
  },
  JWT_ACCESS_SECRET,
  { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, {
            message: 'Invalid email or password.',
          });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, {
            message: 'Invalid email or password.',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
export default passport;
