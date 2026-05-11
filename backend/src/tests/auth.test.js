import request from 'supertest';
import app from '../server.js';
import prisma from '../lib/prisma.js';

describe('Authentication', () => {

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should reject invalid email format', async () => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({
        fullName: 'Test User',
        email: 'invalid-email',
        password: '123456',
        });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid email format');
});

  it('should register a new applicant', async () => {
    
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test user',
        email: `user@test.com`,
        password: 'testing123',
      });

      
    console.log('RESPONSE BODY:', res.body); //  

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('APPLICANT');
  });

  it('should login an existing user and return token', async () => {

    const email = `login${Date.now()}@test.com`;

    await request(app)
        .post('/api/auth/register')
        .send({
        fullName: 'Login User',
        email,
        password: 'loginpassword',
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
        email,
        password: 'loginpassword',
        });

    console.log('LOGIN RESPONSE:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
});
});
