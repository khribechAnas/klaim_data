import { connectDB } from './modules/core/db'
import { config } from './modules/core/config'

const startServer = async (): Promise<void> => {
  try {
    await connectDB()
    const { default: app } = await import('./modules/core/server')

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  } catch (error) {
    console.error('Failed to start application', error)
    process.exit(1)
  }
}

void startServer()
