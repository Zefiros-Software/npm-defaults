import { root } from '~/common/config'
import { PackageType } from '~/common/type'
import { gitignore } from '~/common/ignore'

import fg from 'fast-glob'
import execa from 'execa'
import { Argv } from 'yargs'
import pLimit from 'p-limit'

import path, { join, dirname } from 'path'
import { readFileSync, promises, mkdirSync } from 'fs'

export const projectRoots: Record<string, string> = {
    [PackageType.Library]: root,
    [PackageType.YargsCli]: root,
}

export async function createProject(type: string, name: string, from: string): Promise<void> {
    const targetDir = path.resolve(process.cwd(), name)
    console.log(`creating ${type} in ${targetDir}`)
    await execa('git', ['init', targetDir])

    const ignorePatterns = gitignore(readFileSync(`${from}/.gitignore`).toString())
    const entries = await fg('**/*', { dot: true, cwd: from, followSymbolicLinks: false, ignore: ignorePatterns })

    const limit = pLimit(255)

    const directories = new Set<string>()
    for (const dir of entries.map((f) => dirname(join(targetDir, f)))) {
        directories.add(dir)
    }

    for (const dir of directories) {
        mkdirSync(dir, { recursive: true })
    }

    await Promise.allSettled(
        entries.map((f) =>
            limit(() => {
                console.log(`Copying ${f}`)
                return promises.copyFile(join(from, f), join(targetDir, f))
            })
        )
    )
}

export function builder(yargs: Argv) {
    return yargs
        .option('type', {
            describe: 'package type',
            type: 'string',
            default: PackageType.Library,
            choices: [PackageType.Library, PackageType.YargsCli],
            demand: true,
        })
        .positional('name', {
            describe: 'the new package name',
            type: 'string',
            required: true,
        })
}

export async function handler(argv: ReturnType<typeof builder>['argv']): Promise<void> {
    await createProject(argv.type, argv.name!, `${projectRoots[argv.type]}/examples/${argv.type}`)
}

export default {
    command: 'create <name>',
    describe: 'create a new project',
    builder,
    handler,
}
