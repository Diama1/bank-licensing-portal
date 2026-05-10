import express from 'express';
import passport, {
  createAccessToken,
  serializeUser,
} from '../auth-strategies.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    res.json({ message: 'Registration successful'});
});

router.post('/auth/login',  (req, res, next) => {
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

export default router;  