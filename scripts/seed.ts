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

    console.log('Database cleared')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()
