import dotenv from 'dotenv'

dotenv.config({ quiet: true })

export const config = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI as string,
  dbName: process.env.DB_NAME as string,
  collections: {
    claims: process.env.COLLECTION_CLAIMS as string
  }
}
