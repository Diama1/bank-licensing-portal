import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma.js';

const users = [
  {
    fullName: 'Applicant User',
    email: 'applicant@example.com',
    role: 'APPLICANT',
  },
  {
    fullName: 'Reviewer User',
    email: 'reviewer@example.com',
    role: 'REVIEWER',
  },
  {
    fullName: 'Compliance Officer',
    email: 'compliance.officer@example.com',
    role: 'COMPLIANCE_OFFICER',
  },
  {
    fullName: 'Auditor User',
    email: 'auditor@example.com',
    role: 'AUDITOR',
  },
  {
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
];

const seed = async () => {
  const passwordHash = await bcrypt.hash('TestPwd123!', 12);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        passwordHash,
        role: user.role,
      },
      create: {
        ...user,
        passwordHash,
      },
    });
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
  