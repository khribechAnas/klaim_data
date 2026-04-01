import { ClaimsRepository, InsurerSummary } from './claims.repository'

export class ClaimsService {
  constructor(private readonly repository: ClaimsRepository) {}

  async getInsurers(): Promise<InsurerSummary[]> {
    return this.repository.findDistinctInsurers()
  }
}
