import { Router } from 'express'
import { z } from 'zod'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit } from '../controllers/habitController.ts'

const router = Router()

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  target: z.number().optional(),
  tagIds: z.array(z.string()).optional(),
})

const completeParamsSchema = z.object({
  id: z.string().max(3),
})
router.use(authenticateToken)

router.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: 'got one habit' })
})

router.post('/', validateBody(createHabitSchema), createHabit)

router.delete('/:id', (req, res) => {
  res.json({ message: 'deleted a habit' })
})

router.post(
  '/:id/complete',
  validateParams(completeParamsSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    res.json({ message: 'completed habit' }).status(201)
  },
)

export default router
