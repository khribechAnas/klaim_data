import { Db, MongoClient } from 'mongodb'

import { config } from './config'

let client: MongoClient | null = null
let db: Db | null = null
let connectionPromise: Promise<Db> | null = null

export const connectDB = async (): Promise<Db> => {
  if (db) {
    return db
  }

  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = (async () => {
    try {
      client = new MongoClient(config.mongoUri)
      await client.connect()
      db = client.db(config.dbName)
      console.log(`MongoDB connected to database: ${config.dbName}`)
      return db
    } catch (error) {
      console.error(error)
      client = null
      db = null
      connectionPromise = null
      throw error
    }
  })()

  return connectionPromise
}

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database connection has not been established. Call connectDB() before getDB().')
  }

  return db
}
