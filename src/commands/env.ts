// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { globalDependencies } from '../../package.json'

import execa from 'execa'
import type { Argv } from 'yargs'

export async function install(dependencies: string[] = []): Promise<void> {
    await execa(
        'npm',
        [
            ...[
                'install',
                '-g',
                ...Object.entries(globalDependencies).map(([pkg, version]) => `${pkg}@${version}`),
                ...dependencies,
            ],
        ],
        {
            stdio: 'inherit',
        }
    )
}

export function builder(yargs: Argv) {
    return yargs.option('install', {
        describe: 'install the environment',
        type: 'boolean',
        default: false,
        requiresArg: false,
        demand: true,
    })
}

export async function handler(argv: ReturnType<typeof builder>['argv']): Promise<void> {
    if (argv.install) {
        await install()
    }
}

export default {
    command: 'env',
    describe: 'provision global environment',
    builder,
    handler,
}
