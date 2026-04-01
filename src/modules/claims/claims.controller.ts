import { RequestHandler } from 'express'

import { ClaimsService } from './claims.service'

export class ClaimsController {
  constructor(private readonly service: ClaimsService) {}

  getInsurers: RequestHandler = async (_req, res) => {
    try {
      const insurers = await this.service.getInsurers()
      res.json({
        totalCount: insurers.length,
        insurers
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
