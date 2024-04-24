import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text
} from 'drizzle-orm/pg-core'

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull()
})

// This is a relation between the courses and userProgress tables
// It allows us to query the userProgress table and get the courses that the user is currently taking

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress), // This is a one-to-many relationship
  units: many(units) // This is a one-to-many relationship
}))

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  order: integer('order').notNull()
})

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id]
  }),
  lesson: many(lessons)
}))

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  unitId: integer('unit_id')
    .references(() => units.id, {
      onDelete: 'cascade' // This will delete all lessons associated with a unit when the unit is deleted
    })
    .notNull(),
  order: integer('order').notNull()
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id]
  }),
  challenges: many(challenges)
}))

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST'])

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  lessonId: integer('lesson_id')
    .references(() => units.id, {
      onDelete: 'cascade' // This will delete all lessons associated with a unit when the unit is deleted
    })
    .notNull(),
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull()
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id]
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress)
}))

export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  challengeId: integer('challengeId')
    .references(() => challenges.id, {
      onDelete: 'cascade' // This will delete all lessons associated with a unit when the unit is deleted
    })
    .notNull(),
  text: text('text').notNull(),
  correct: boolean('correct').notNull(),
  imageSrc: text('image_src')
})

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    lesson: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id]
    })
  })
)

export const challengeProgress = pgTable('challenge_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // TODO: Confirm this doesnt break
  challengeId: integer('challengeId')
    .references(() => challenges.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  completed: boolean('completed').notNull().default(false)
})

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id]
    })
  })
)

export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImageSrc: text('user_image_src').notNull().default('/logo.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade'
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0)
})

// This is a relation between the userProgress and courses tables
// It allows us to query the userProgress table and get the active course that the user is currently taking

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id]
  })
}))
