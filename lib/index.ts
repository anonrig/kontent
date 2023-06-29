import { options } from './mdx'
import { compile } from '@mdx-js/mdx'
import { promises as fs } from 'node:fs'

const engineFolder = './.engine'

await fs.rm(engineFolder, { force: true, recursive: true })
await fs.mkdir(engineFolder)

const folder = await fs.opendir('./content')

for await (const file of folder) {
  if (file.isFile() && file.name.endsWith('.mdx')) {
    const content = await fs.readFile(`./content/${file.name}`)
    const out = await compile(content, {
      ...options,
      development: false,
    })
    await fs.writeFile(
      `./.engine/${file.name.replace('.mdx', '.json')}`,
      JSON.stringify(out, null, 2),
    )
  }
}
