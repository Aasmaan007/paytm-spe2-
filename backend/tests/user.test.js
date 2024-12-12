const request = require('supertest');
const app = require('../index'); // Import the app from your index.js
const { User } = require('../db.js');

describe('User Routes', () => {
  beforeAll(async () => {
    // Add any setup logic if needed, such as connecting to the database
  });

  afterAll(async () => {
    // Cleanup logic, such as closing database connections
  });

  afterEach(async () => {
    // Cleanup logic for test isolation, such as removing test users
    await User.deleteMany({});
  });

  test('POST /api/v1/user/signup - should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send({
        username: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      });
// oianf
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body).toHaveProperty('token');
  } , 10000);

  test('POST /api/v1/user/signin - should log in a user', async () => {
    // First, create a user
    await User.create({
      username: 'testuser@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
    });

    // Then, try to log in
    const response = await request(app)
      .post('/api/v1/user/signin')
      .send({
        username: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Signin successful');
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/v1/user/signup - should fail for duplicate email', async () => {
    // First, create a user
    await User.create({
      username: 'testuser@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
    });

    // Try to sign up with the same email
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send({
        username: 'testuser@example.com',
        firstName: 'Test2',
        lastName: 'User2',
        password: 'password456',
      });

    expect(response.status).toBe(409); // Conflict
    expect(response.body).toHaveProperty('message', 'Email already taken');
  });
});
