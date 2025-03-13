import { glob } from 'glob'

// Updates vimina version in Vitest snapshots, etc.

console.log('Updating Vimina version.')

const file = Bun.file('package.json')
const packageJson = await file.json()
const viminaVersion = packageJson.devDependencies.vimina

// Update Vitest snapshots
// Get all *.test.ts files
const testPaths = await glob('packages/**/*.test.ts', {
  ignore: ['**/dist/**', '**/node_modules/**'],
})

let count = 0
for (const testPath of testPaths) {
  const file = Bun.file(testPath)
  const testFile = await file.text()

  // Skip files that don't contain vimina version
  if (!testFile.includes('Version: vimina@')) continue
  // Skip files that contain current version
  if (testFile.includes(`Version: vimina@${viminaVersion}`)) continue

  console.log(testPath)
  const updatedTestFile = testFile.replace(
    /Version: vimina@[A-Za-z0-9\-\.]+/g,
    `Version: vimina@${viminaVersion}`,
  )
  await Bun.write(testPath, updatedTestFile)

  count += 1
}

// // Update package.json#pnpm.overrides.vimina
// if (packageJson.pnpm?.overrides?.vimina !== viminaVersion) {
//   const path = 'package.json'
//   console.log(path)
//   packageJson.pnpm.overrides.vimina = viminaVersion
//   await Bun.write(path, `${JSON.stringify(packageJson, undefined, 2)}\n`)
//   count += 1
// }

console.log(`Done. Updated ${count} ${count === 1 ? 'file' : 'files'}.`)
