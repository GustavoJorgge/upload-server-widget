import { env } from '@/env'
import type { Config} from 'drizzle-kit'

export default{
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    dialect: 'postgresql',
    schema:'src/infra/db/schemas/*',//onde estará o schema do banco (as tabelas)
    out: 'src/infra/db/migrations',
} satisfies Config