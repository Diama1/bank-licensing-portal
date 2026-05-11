import express from 'express';
import prisma from '../lib/prisma';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.post ('/', authenticateAccessToken, async (req, res) => {
    try {
        const { userId, businessName, licenseType} = req.body;

        if (!businessName || !licenseType ) {
            return res.status(400).json({error: 'Business name and license type are required'})
        }

        const application = await prisma.application.create({
            data: {
                userId,
                businessName,
                licenseType,
            },
        });
        res.status(201).json({success: true, application});

    } catch (error) {
    res.status(500).json({error: 'error occurred while creating the application'});
    }
});
  


export default router;
