import { Collection, Db, Document, ObjectId, WithId } from 'mongodb'

import { getDB } from '../core/db'

export type InsurerSummary = {
  id: string
  name: string | null
}

type InsurerDocument = WithId<Document>

export class ClaimsRepository {
  private readonly db: Db
  private readonly insurersCollection: Collection<InsurerDocument>

  constructor() {
    this.db = getDB()
    this.insurersCollection = this.db.collection<InsurerDocument>('insurers')
  }

  async findDistinctInsurers(): Promise<InsurerSummary[]> {
    const insurersCollectionExists = await this.db
      .listCollections({ name: 'insurers' }, { nameOnly: true })
      .hasNext()

    if (!insurersCollectionExists) {
      return []
    }

    const insurers = await this.insurersCollection.find({}).toArray()
    const uniqueInsurers = new Map<string, InsurerSummary>()

    for (const insurer of insurers) {
      const id = insurer._id instanceof ObjectId ? insurer._id.toHexString() : String(insurer._id)
      const rawName = this.resolveInsurerName(insurer)
      const name = typeof rawName === 'string' ? rawName.trim() : null
      const dedupeKey = name ? name.toLocaleLowerCase() : `id:${id}`

      if (!uniqueInsurers.has(dedupeKey)) {
        uniqueInsurers.set(dedupeKey, { id, name })
      }
    }

    return Array.from(uniqueInsurers.values()).sort((left, right) => {
      const leftKey = left.name ?? left.id
      const rightKey = right.name ?? right.id

      return leftKey.localeCompare(rightKey)
    })
  }

  private resolveInsurerName(insurer: InsurerDocument): string | null {
    const candidates = [
      insurer.name,
      insurer.insurerName,
      insurer.companyName,
      insurer.displayName,
      insurer.label
    ]

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate
      }
    }

    return null
  }
}
