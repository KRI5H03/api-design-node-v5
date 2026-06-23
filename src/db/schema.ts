import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 235 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 235 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  upatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }).notNull(),
  target: integer('target').default(1),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  upatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completionDate: timestamp('completion_date').notNull().defaultNow(),
  note: text('note'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }).default('#6b7280'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  upatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const habitTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const userRelationships = relations(users, ({ many }) => ({
  habits: many(habits),
}))

export const habitsRelationships = relations(habits, ({ one, many }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  entries: many(entries),
  habitTags: many(habitTags),
}))

export const entriesRelations = relations(entries, ({ one }) => ({
  habits: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

export const habitTagsRelations = relations(habitTags, ({ one }) => ({
  habits: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

export type User = typeof users.$inferSelect
export type newUser = typeof users.$inferInsert
export type Habits = typeof habits.$inferSelect
export type newHabits = typeof habits.$inferInsert
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitTags.$inferSelect

export const insertedUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
