import { mkdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const images = [
  ['public/images/memory-cover- new.png', 'public/images/optimized/memory-cover-new.webp'],
  ['public/images/quest-cover-new.png', 'public/images/optimized/quest-cover-new.webp'],
  ['public/images/storyboard-cover-new.png', 'public/images/optimized/storyboard-cover-new.webp'],
  ['public/images/storyboard-cards.png', 'public/images/optimized/storyboard-cards.webp'],
  ['public/images/back-card.png', 'public/images/optimized/back-card.webp'],
  ['public/images/victory-screen.png', 'public/images/optimized/victory-screen.webp'],
]

for (const [sourcePath, outputPath] of images) {
  const source = resolve(sourcePath)
  const output = resolve(outputPath)
  await mkdir(dirname(output), { recursive: true })
  await sharp(source)
    .rotate()
    .webp({ quality: 82, alphaQuality: 90, smartSubsample: true })
    .toFile(output)

  const [sourceInfo, outputInfo] = await Promise.all([stat(source), stat(output)])
  const savedPercent = Math.round((1 - outputInfo.size / sourceInfo.size) * 100)
  console.log(`${outputPath}: ${savedPercent}% smaller`)
}
