import { root } from '~/common/config'
import { PackageType } from '~/common/type'

import copy from 'recursive-copy'
import execa from 'execa'
import { Argv } from 'yargs'

import path from 'path'

export const projectRoots: Record<string, string> = {
    [PackageType.Library]: root,
    [PackageType.YargsCli]: root,
}

export async function createProject(type: string, name: string, from: string): Promise<void> {
    const targetDir = path.resolve(process.cwd(), name)
    console.log(`creating ${type} in ${targetDir}`)
    await execa('git', ['init', targetDir])
    await copy(from, targetDir, {
        debug: true,
        dot: true,
        overwrite: true,
        filter: [
            '**/*',
            '!node_modules{/**,}',
            '!coverage{/**,}',
            '!dist{/**,}',
            '!dist',
            '!yarn.lock',
            '!yarn-error.log',
            '!.yalc{/**,}',
            '!yalc.lock',
        ],
    })
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
