import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrateQuestionBankToPostgreSql } from '../src/services/questionBankToPostgreSqlMigration'
import { PostgreSqlQuestionRepository } from '../src/services/questionRepository'
import { ApplicationDbContext } from '../src/services/applicationDbContext'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.resolve(__dirname, '../src/data/questionBanks/questionBanks.json')

const content = await readFile(dataFile, 'utf-8')
const source = JSON.parse(content) as unknown

const context = new ApplicationDbContext({ connectionString: 'memory://migration' })
const repository = new PostgreSqlQuestionRepository(context, [])

const report = await migrateQuestionBankToPostgreSql(source, repository, { reset: true })

console.log(JSON.stringify(report, null, 2))

if (!report.success) {
  throw new Error('PostgreSQL question bank migration failed')
}
