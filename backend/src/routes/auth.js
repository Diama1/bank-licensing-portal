import express from 'express';

const router = express.Router();

router.post('/register', async (req, res) => {
    res.status(201).json({ message: 'User registered successfully'});
 
});

router.post('/login', (req, res) => {
    res.json({ message: 'Get Login successful'});
});

export default router;  