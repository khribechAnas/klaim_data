import express from 'express'

import claimsRouter from '../claims/claims.routes'

const app = express()

app.use(express.json())
app.use('/api', claimsRouter)

export default app
