import { Collection, Db, Document, ObjectId, WithId } from 'mongodb'

import { getDB } from '../core/db'
import { config } from '../core/config'

type ClaimDocument = WithId<Document> & {
  insurer: ObjectId
}

export class ClaimsRepository {
  private readonly db: Db
  private readonly collection: Collection<ClaimDocument>

  constructor() {
    this.db = getDB()
    this.collection = this.db.collection<ClaimDocument>(config.collections.claims)
  }

  async findAll(): Promise<any[]> {
    return []
  }

  async findDistinctInsurers(): Promise<string[]> {
    const insurers = await this.collection.distinct('insurer')

    return insurers
      .filter((insurer): insurer is ObjectId => insurer instanceof ObjectId)
      .map((insurer) => insurer.toHexString())
      .sort((left, right) => left.localeCompare(right))
  }

  async findByInsurerId(insurerId: string): Promise<any[]> {
    const insurerObjectId = new ObjectId(insurerId)
    const claims = await this.collection.find({ insurer: insurerObjectId }).toArray()

    return claims
  }
}
