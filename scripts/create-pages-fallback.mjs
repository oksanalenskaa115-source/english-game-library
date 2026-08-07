import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const indexFile = resolve('dist/index.html')
const fallbackFile = resolve('dist/404.html')

await copyFile(indexFile, fallbackFile)
console.log('Created dist/404.html for direct React Router links.')
