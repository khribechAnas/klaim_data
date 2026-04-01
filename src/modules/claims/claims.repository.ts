import { Collection, Db, Document } from 'mongodb'

import { getDB } from '../core/db'
import { config } from '../core/config'

export type InsurerSummary = {
  id: string
  name: string | null
}

export class ClaimsRepository {
  private readonly db: Db
  private readonly claimsCollection: Collection<Document>

  constructor() {
    this.db = getDB()
    this.claimsCollection = this.db.collection<Document>(config.collections.claims)
  }

  async findDistinctInsurers(): Promise<InsurerSummary[]> {
    const insurers = await this.claimsCollection.aggregate<InsurerSummary>([
      {
        $match: {
          insurer: {
            $exists: true,
            $ne: null
          }
        }
      },
      {
        $group: {
          _id: '$insurer'
        }
      },
      {
        $lookup: {
          from: config.collections.insurers,
          localField: '_id',
          foreignField: '_id',
          as: 'insurerDetails'
        }
      },
      {
        $unwind: {
          path: '$insurerDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: {
            $ifNull: ['$insurerDetails.name', null]
          }
        }
      },
      {
        $sort: {
          name: 1,
          id: 1
        }
      }
    ]).toArray()

    return insurers
  }
}
