import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { db } from '../db/connection.ts'
import { habits, habitTags, entries, tags } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'
import { any } from 'zod'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, target, tagIds } = req.body

    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: (req as any).user?.id,
          name,
          description,
          frequency,
          target,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId) => ({
          habitId: newHabit.id,
          tagId,
        }))

        await tx.insert(habitTags).values(habitTagValues)
      }

      return newHabit
    })

    res.status(200).json({
      message: 'Habit created',
      habit: result,
    })
  } catch (e) {
    console.error('Create habit error', e)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}
