import { ClaimsRepository } from './claims.repository'

export class ClaimsService {
  constructor(private readonly repository: ClaimsRepository) {}

  async getAll(): Promise<any[]> {
    return this.repository.findAll()
  }

  async getInsurers(): Promise<string[]> {
    return this.repository.findDistinctInsurers()
  }

  async getInsurerClaims(insurerId: string): Promise<any[]> {
    return this.repository.findByInsurerId(insurerId)
  }
}
