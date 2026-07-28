import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { questionBanksSchema } from '../src/schemas/questionBankSchema'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.resolve(__dirname, '../src/data/questionBanks/questionBanks.json')

const content = await readFile(dataFile, 'utf-8')
const data = JSON.parse(content)

const result = questionBanksSchema.safeParse(data)

if (!result.success) {
  console.error(`File: ${dataFile}`)
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  }
  throw new Error('Question bank validation failed')
}

console.log(`Question bank file is valid (${result.data.length} questions)`)
