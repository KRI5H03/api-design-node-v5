import { db } from '../../src/db/connection.ts'
import {
  users,
  habits,
  entries,
  type newUser,
  type newHabits,
  habitTags,
  tags,
} from '../../src/db/schema.ts'
import { generateToken } from '../../src/utils/jwt.ts'
import { hashPasswords } from '../../src/utils/paswords.ts'

export const createTestUser = async (userData: Partial<newUser> = {}) => {
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    username: `user-${Date.now()}-${Math.random()}`,
    password: 'admin1234',
    firstName: 'Test',
    lastName: 'User',
    ...userData,
  }

  const hashedPassword = await hashPasswords(defaultData.password)
  const [user] = await db
    .insert(users)
    .values({
      ...defaultData,
      password: hashedPassword,
    })
    .returning()

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return { token, user, rawPassword: defaultData.password }
}

export const createTestHabit = async (
  userId: string,
  habitData: Partial<newHabits> = {},
) => {
  const defaultData = {
    name: `Test-${Date.now()}`,
    description: 'Test Habit',
    frequency: 'daily',
    target: 1,
    ...habitData,
  }

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...defaultData,
    })
    .returning()

  return habit
}

export const cleanUpDatabase = async () => {
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
  await db.delete(habitTags)
  await db.delete(tags)
}
