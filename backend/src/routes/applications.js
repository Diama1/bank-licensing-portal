import express from 'express';
import prisma from '../lib/prisma';
import { authenticateAccessToken } from '../middleware/auth.js';
import { authorize} from '../middleware/role.js';
import {Role} from '@prisma/client';
import multer from 'multer';
import path from 'path';
import {upload} from '../middleware/uploads.js';

const router = express.Router();

router.post ('/', authenticateAccessToken, authorize(Role.APPLICANT), async (req, res) => {
    try {
        const {businessName, licenseType} = req.body;

        if (!businessName || !licenseType ) {
            return res.status(400).json({error: 'Business name and license type are required'})
        }

        const application = await prisma.application.create({
            data: {
                userId: req.user.id,
                businessName,
                licenseType,
            },
        });
        res.status(201).json({success: true, application});

    } catch (error) {
    res.status(500).json({error: 'error occurred while creating the application'});
    }
});

router.post( '/:id/documents', authenticateAccessToken, authorize(Role.APPLICANT), upload.array('files', 5), async (req, res) => {

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'File is required' });
    }

    const lastDoc = await prisma.applicationDocument.findFirst({
      where: { applicationId: req.params.id },
      orderBy: { version: 'desc' },
    });

    let version = lastDoc ? lastDoc.version + 1 : 1;

    const createdDocs = [];

    for (const file of files) {
      const document = await prisma.applicationDocument.create({
        data: {
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          filePath: file.path,
          version,
          uploadedBy: req.user.id,

          application: {
            connect: {
              id: req.params.id,
            },
          },
        },
      });

      createdDocs.push(document);
    }

    return res.status(201).json({
      success: true,
      version,
      documents: createdDocs,
    });
  }
);

router.patch('/:id', authenticateAccessToken, async (req, res) => {
  const application = await prisma.application.update({
    where: { id: req.params.id },
  });

  if (
    application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW' || application.status === 'APPROVED' || application.status === 'REJECTED'
  ) {
    return res.status(400).json({error: 'Cannot edit the application'});
  }
  const updated = await prisma.application.update({
    where: {id: req.params.id},
    data: req.body,
  });
  res.json({success: true, application: updated });


});

router.patch('/:id/request-correction', authenticateAccessToken, authorize(Role.REVIEWER, Role.COMPLIANCE_OFFICER), async (req, res) => {
    try {
        const { notes } = req.body;
        const application = await prisma.application.update({
            where: { id: req.params.id },
            data: {status: 'NEEDS_CORRECTION', correctionNote: notes},
        });
        return res.json({succcess: true, message: 'Correction requested' ,application});

    } catch (error) {
        return res.status(500).json({error: 'Failed to request correction'});
    }
});

router.patch(
  '/:id/submit',
  authenticateAccessToken,
  authorize(Role.APPLICANT),
  async (req, res) => {
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status: 'SUBMITTED',
      },
    });

    return res.json({
      success: true,
      message: 'Application resubmitted',
      application,
    });
  }
);


  


export default router;
