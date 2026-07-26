import security from './security.json'
import networking from './networking.json'
import compute from './compute.json'
import storage from './storage.json'
import databases from './databases.json'

const allQuestions = [
  ...security,
  ...networking,
  ...compute,
  ...storage,
  ...databases,
]

export default allQuestions
