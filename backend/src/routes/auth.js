import express from 'express';
import bcrypt from 'bcrypt';
import passport, {
  createAccessToken,
  serializeUser,
} from '../auth-strategies.js';
import prisma from '../lib/prisma.js';


const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ error: 'User is already registered' });
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const user =await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash,
                role: 'APPLICANT',
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: serializeUser(user),
        });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred during registration' });
    }
});

router.post('/login',  (req, res, next) => {
 passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    
    if (!user){
        return res.status(401).json({error: info.message || 'Invalid Email or Password'});
    }

    const accessToken = createAccessToken(user);
    
    return res.json({
        success: true,
        accessToken,
        tokenType: 'Bearer',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h',
        message: 'Registration successful',
        user: serializeUser(user),
    });
})(req, res, next);
});

router.get('/ping', (req, res) => {
  res.json({ ok: true });
});

export default router;  