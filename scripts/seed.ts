import 'dotenv/config'

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Seeding database...')
    await db.delete(schema.userProgress)
    await db.delete(schema.courses)
    await db.delete(schema.units)
    await db.delete(schema.lessons)
    await db.delete(schema.challenges)
    await db.delete(schema.challengeOptions)
    await db.delete(schema.challengeProgress)

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Engenharia de Software',
        imageSrc: '/settings.svg'
      },
      {
        id: 2,
        title: 'Banco de Dados',
        imageSrc: '/database.svg'
      },
      {
        id: 3,
        title: 'Linguagem de Programação II',
        imageSrc: '/code.svg'
      },
      {
        id: 4,
        title: 'Arquitetura de Sistemas Computacionais',
        imageSrc: '/programming.svg'
      }
    ])

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: 'Desenvolvimento de Software',
        description: 'Conceitos básicos de Engenharia de Software',
        order: 1
      }
    ])

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        title: 'Lição 1',
        order: 1
      },
      {
        id: 2,
        unitId: 1,
        title: 'Lição 2',
        order: 2
      },
      {
        id: 3,
        unitId: 1,
        title: 'Lição 3',
        order: 3
      },
      {
        id: 4,
        unitId: 1,
        title: 'Lição 4',
        order: 4
      },
      {
        id: 5,
        unitId: 1,
        title: 'Lição 5',
        order: 5
      }
    ])

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: 'SELECT',
        order: 1,
        question: 'O que é um Software?'
      }
    ])

    await db.insert(schema.challengeOptions).values([
      {
        id: 1,
        challengeId: 1,
        correct: true,
        text: 'Um conjunto de instruções que quando executadas realizam uma ou várias tarefas específicas, podendo ser na forma de programas, procedimentos, algoritmos, entre outros.'
      },
      {
        id: 2,
        challengeId: 1,
        correct: false,
        text: 'Dispositivo físico que executa tarefas específicas.'
      },
      {
        id: 3,
        challengeId: 1,
        correct: false,
        text: 'Sistema de Hardware utilizado para armazenar informações.'
      }
    ])

    console.log('Seeding finished')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()
