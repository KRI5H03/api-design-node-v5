import { Router } from 'express'
import { login, registers } from '../controllers/authController.ts'
import { validateBody } from '../middleware/validation.ts'
import { insertedUserSchema } from '../db/schema.ts'
import { z } from 'zod'

const router = Router()

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

router.post('/register', validateBody(insertedUserSchema), registers)

router.post('/login', validateBody(loginSchema), login)

export default router
