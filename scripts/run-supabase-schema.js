/**
 * Выполняет supabase-schema.sql в вашем проекте Supabase.
 * Нужна строка подключения к БД из Supabase (Settings → Database).
 *
 * В .env добавьте (подставьте свой пароль от БД):
 *   SUPABASE_DB_URL=postgresql://postgres.XXXXX:ВАШ_ПАРОЛЬ_БД@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
 *
 * Затем: npm run db:schema
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env')
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*SUPABASE_DB_URL\s*=\s*(.+?)\s*$/)
      if (m) return m[1].replace(/^["']|["']$/g, '').trim()
    }
  } catch (_) {}
  return process.env.SUPABASE_DB_URL
}

async function main() {
  const dbUrl = await loadEnv()
  if (!dbUrl) {
    console.error(`
Ошибка: не найден SUPABASE_DB_URL.

1. Откройте Supabase → ваш проект → Settings (шестерёнка) → Database.
2. В блоке "Connection string" выберите "URI" и скопируйте строку.
3. Замените [YOUR-PASSWORD] на пароль от БД (тот же, что при создании проекта).
4. Добавьте в файл .env в корне проекта строку:
   SUPABASE_DB_URL=postgresql://postgres.xxx:пароль@...
5. Запустите снова: npm run db:schema
`)
    process.exit(1)
  }

  let pg
  try {
    pg = await import('pg')
  } catch {
    console.error('Установите pg: npm install pg')
    process.exit(1)
  }

  const sqlPath = join(__dirname, '..', 'supabase-schema.sql')
  const sql = readFileSync(sqlPath, 'utf8')

  const client = new pg.default.Client({ connectionString: dbUrl })
  try {
    await client.connect()
    await client.query(sql)
    console.log('Готово. Таблицы site_settings, projects и др. созданы. Обновите страницу админки (F5).')
  } catch (e) {
    console.error('Ошибка при выполнении SQL:', e.message)
    if (e.message && (e.message.includes('ENOTFOUND') || e.message.includes('getaddrinfo'))) {
      console.error(`
Подключение по адресу db.xxx.supabase.co не работает. Используйте Connection pooling (pooler):

1. Supabase → Settings → Database → Connection string.
2. Включите "Use connection pooling" (или выберите "Transaction" / "Session").
3. Скопируйте URI — хост должен быть aws-0-XXX.pooler.supabase.com (порт 6543 или 5432).
4. Замените [YOUR-PASSWORD] на пароль, в .env пропишите:
   SUPABASE_DB_URL=postgresql://postgres.КОДПРОЕКТА:пароль@aws-0-РЕГИОН.pooler.supabase.com:6543/postgres
5. Запустите снова: npm run db:schema
`)
    } else if (e.message && e.message.includes('password')) {
      console.error('Проверьте пароль в SUPABASE_DB_URL (пароль БД из Supabase → Settings → Database).')
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
