import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateQuestions } from '../src/utils/questionValidation'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../src/data/questions')

const files = await readdir(dataDir)
let hasErrors = false

for (const file of files) {
  if (!file.endsWith('.json')) {
    continue
  }

  const filePath = path.join(dataDir, file)
  const content = await readFile(filePath, 'utf-8')

  let data: unknown
  try {
    data = JSON.parse(content)
  } catch {
    console.error(`File: ${filePath}\n  Invalid JSON`)
    hasErrors = true
    continue
  }

  const result = validateQuestions(data)
  if (!result.valid) {
    hasErrors = true
    console.error(`File: ${filePath}`)
    for (const error of result.errors) {
      console.error(`  - ${error}`)
    }
  }
}

if (hasErrors) {
  throw new Error('Question validation failed')
}

console.log('All question files are valid')
