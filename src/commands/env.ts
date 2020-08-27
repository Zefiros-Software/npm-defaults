import execa from 'execa'
import type { Argv } from 'yargs'

interface PackageJsonDependencies {
    globalDependencies: Record<string, string>
}

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { globalDependencies }: PackageJsonDependencies = require('../../package.json')

export async function install(dependencies: readonly string[] = []): Promise<void> {
    await execa(
        'npm',
        [
            ...[
                'install',
                '-g',
                ...Object.entries(globalDependencies).map(([pkg, version]: readonly [string, string]) => `${pkg}@${version}`),
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
