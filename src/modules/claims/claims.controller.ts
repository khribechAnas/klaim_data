import { RequestHandler } from 'express'
import { ObjectId } from 'mongodb'

import { ClaimsService } from './claims.service'

export class ClaimsController {
  constructor(private readonly service: ClaimsService) {}

  getAll: RequestHandler = async (_req, res) => {
    try {
      const claims = await this.service.getAll()
      res.json(claims)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getInsurers: RequestHandler = async (_req, res) => {
    try {
      const insurers = await this.service.getInsurers()
      res.json(insurers)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getInsurerClaims: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const id = req.params.id

      if (!ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid insurer id' })
        return
      }

      const claims = await this.service.getInsurerClaims(id)
      res.json({
        insurerId: id,
        claims
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
