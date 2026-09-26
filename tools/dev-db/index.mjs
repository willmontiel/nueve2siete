// Starts a local Postgres 17 for development. Data lives in <root>/.data/postgres.
// On the server we'll use the official Postgres container (see docker-compose.yml).
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const databaseDir = path.join(root, '.data', 'postgres')
const port = Number(process.env.PGPORT ?? 5432)
const database = process.env.PGDATABASE ?? 'nueve2siete'

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'postgres',
  password: 'postgres',
  port,
  persistent: true,
  onLog: () => {},
})

if (!existsSync(path.join(databaseDir, 'PG_VERSION'))) {
  console.log('[dev-db] Initializing database in', databaseDir)
  await pg.initialise()
}

await pg.start()

try {
  await pg.createDatabase(database)
  console.log(`[dev-db] Database "${database}" created`)
} catch {
  // Already exists.
}

console.log(`[dev-db] Postgres ready: postgresql://postgres:postgres@127.0.0.1:${port}/${database}`)

let stopping = false
const stop = async () => {
  if (stopping) return
  stopping = true
  console.log('[dev-db] Stopping Postgres…')
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)

// Keeps the process alive while Postgres runs.
setInterval(() => {}, 1 << 30)
