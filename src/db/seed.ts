import 'dotenv/config'
import { db } from './connection.ts'
import { users, habits, habitTags, tags, entries } from './schema.ts'

const seed = async () => {
  console.log('🌱 Starting database seed....')
  try {
    console.log('Clearing existing data....')
    await db.delete(entries)
    await db.delete(tags)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(users)

    console.log('creating demo users')
    const [demouser] = await db
      .insert(users)
      .values({
        email: 'johndoe@gmail.com',
        password: 'password',
        firstName: 'demo',
        lastName: 'person',
        username: 'demo',
      })
      .returning()

    const [excerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demouser.id,
        name: 'Exercise',
        description: 'Daily Workout',
        frequency: 'daily',
        target: 1,
      })
      .returning()

    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#f0f0f0' })
      .returning()

    await db.insert(habitTags).values({
      habitId: excerciseHabit.id,
      tagId: healthTag.id,
    })

    console.log('Adding completion entries')

    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      await db.insert(entries).values({
        habitId: excerciseHabit.id,
        completionDate: date,
      })
    }

    console.log('✅ DB seeded successfully')
    console.log('user credentials: ')
    console.log(`email: ${demouser.email}`)
    console.log(`username: ${demouser.username}`)
    console.log(`password: ${demouser.password}`)
  } catch (e) {
    console.log('❌ seed failed', e)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => process.exit(1))
}

export default seed
