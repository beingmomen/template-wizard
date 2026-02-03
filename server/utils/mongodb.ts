import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

const inMemoryStore: Record<string, any[]> = {}

function createInMemoryDb() {
  return {
    collection(name: string) {
      if (!inMemoryStore[name]) inMemoryStore[name] = []
      const store = inMemoryStore[name]
      return {
        async findOne(query: Record<string, any>, _options?: any) {
          return store.find((doc: any) => {
            return Object.entries(query).every(([k, v]) => doc[k] === v)
          }) || null
        },
        async find(query: Record<string, any> = {}) {
          const results = store.filter((doc: any) => {
            return Object.entries(query).every(([k, v]) => {
              if (v && typeof v === 'object' && '$ne' in v) return doc[k] !== v.$ne
              if (v && typeof v === 'object' && '$exists' in v) return v.$exists ? doc[k] !== undefined : doc[k] === undefined
              return doc[k] === v
            })
          })
          return {
            sort: () => ({
              skip: (n: number) => ({
                limit: (l: number) => ({
                  toArray: async () => results.slice(n, n + l)
                })
              }),
              toArray: async () => results
            }),
            toArray: async () => results
          }
        },
        async insertOne(doc: any) {
          store.push({ ...doc })
          return { insertedId: doc.projectId || 'mock-id' }
        },
        async updateOne(query: Record<string, any>, update: any) {
          const idx = store.findIndex((doc: any) =>
            Object.entries(query).every(([k, v]) => doc[k] === v)
          )
          if (idx === -1) return { matchedCount: 0 }
          if (update.$set) Object.assign(store[idx], update.$set)
          return { matchedCount: 1 }
        },
        async deleteOne(query: Record<string, any>) {
          const idx = store.findIndex((doc: any) =>
            Object.entries(query).every(([k, v]) => doc[k] === v)
          )
          if (idx === -1) return { deletedCount: 0 }
          store.splice(idx, 1)
          return { deletedCount: 1 }
        },
        async countDocuments(query: Record<string, any> = {}) {
          return store.filter((doc: any) =>
            Object.entries(query).every(([k, v]) => {
              if (v && typeof v === 'object' && '$ne' in v) return doc[k] !== v.$ne
              if (v && typeof v === 'object' && '$exists' in v) return v.$exists ? doc[k] !== undefined : doc[k] === undefined
              return doc[k] === v
            })
          ).length
        }
      }
    }
  }
}

export async function connectToDatabase(): Promise<Db> {
  if (db) return db

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI not set — using in-memory mock store')
    db = createInMemoryDb() as unknown as Db
    return db
  }

  client = new MongoClient(uri)
  await client.connect()
  db = client.db('project-wizard')

  return db
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
