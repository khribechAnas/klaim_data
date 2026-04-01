import { Router } from 'express'

import { ClaimsController } from './claims.controller'
import { ClaimsRepository } from './claims.repository'
import { ClaimsService } from './claims.service'

const router = Router()
const repository = new ClaimsRepository()
const service = new ClaimsService(repository)
const controller = new ClaimsController(service)

router.get('/claims/insurers', controller.getInsurers)
router.get('/claims/insurers/:id', controller.getInsurerClaims)
router.get('/claims', controller.getAll)

export default router
