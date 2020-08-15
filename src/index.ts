import ci from '~/commands/ci'
import create from '~/commands/create'
import env from '~/commands/env'
import lint from '~/commands/lint'
import makeRelease from '~/commands/make-release'
import release from '~/commands/release'
import { setConfigurationKey } from '~/common/config'
import { PackageType } from '~/common/type'

import yargs from 'yargs'
import { install } from 'source-map-support'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { bin } = require('../package.json')

// eslint-disable-next-line @typescript-eslint/require-await
export async function run(): Promise<void> {
    install()

    yargs
        .scriptName(Object.keys(bin)[0])
        .command(ci)
        .command(create)
        .command(env)
        .command(lint)
        .command(release)
        .command(makeRelease)
        .demandCommand()
        .strict()
        .help().argv
}

export { ci, create, env, lint, makeRelease, release, PackageType, setConfigurationKey }
