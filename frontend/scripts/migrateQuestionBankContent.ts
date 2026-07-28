import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrateQuestionBankContent } from '../src/services/questionBankContentMigration'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(__dirname, '../src/data/questions')
const outputDir = path.resolve(__dirname, '../src/data/questionBanks')
const outputFile = path.join(outputDir, 'questionBanks.json')
const certificationExamId = 'saa-c03'

const files = await readdir(sourceDir)
const inputs = []

for (const file of files) {
  if (!file.endsWith('.json')) {
    continue
  }

  const filePath = path.join(sourceDir, file)
  const content = JSON.parse(await readFile(filePath, 'utf-8'))
  inputs.push({ fileName: file, content })
}

const { success, report, questionBanks } = migrateQuestionBankContent(inputs, certificationExamId)

if (!success) {
  console.log(JSON.stringify(report, null, 2))
  throw new Error('Question bank content migration failed')
}

await mkdir(outputDir, { recursive: true })
await writeFile(outputFile, `${JSON.stringify(questionBanks, null, 2)}\n`)

console.log(JSON.stringify(report, null, 2))
