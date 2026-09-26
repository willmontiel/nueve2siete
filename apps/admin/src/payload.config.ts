import { buildCmsConfig } from '@nueve2siete/cms'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// The admin owns the schema: in development it syncs the tables and regenerates the types.
export default buildCmsConfig({ ownsSchema: true, importMapBaseDir: dirname })
