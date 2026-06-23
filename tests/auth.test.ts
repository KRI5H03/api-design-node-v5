import request from 'supertest'
import app from '../src/server.ts'
import env from '../env.ts'
import {
  createTestHabit,
  cleanUpDatabase,
  createTestUser,
} from './setup/dbHelper.ts'

describe('Authentication Endpoints', () => {
  //makes a test window not the actual test
  afterEach(async () => {
    await cleanUpDatabase()
  })
  describe('POST /api/auth/register', () => {
    //these can be nested
    it('should register a new user with valid data', async () => {
      //actual test a describe is a window in which the test runs and a window can have multiple tests
      const userData = {
        email: 'testemail@test.com',
        username: 'test user',
        password: 'admin1234',
      }
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should log in with valid credentials', async () => {
      const testUser = await createTestUser()

      const credentials = {
        email: testUser.user.email,
        password: testUser.rawPassword,
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(201)

      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')
    })
  })
})
