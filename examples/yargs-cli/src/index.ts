import goodbye from '~/commands/goodbye'
import hello from '~/commands/hello'

import yargs from 'yargs'
import { install } from 'source-map-support'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { bin } = require('../package.json')

// eslint-disable-next-line @typescript-eslint/require-await
export async function run(): Promise<void> {
    install()

    yargs.scriptName(Object.keys(bin)[0]).command(goodbye).command(hello).demandCommand().strict().help().argv
}

export default {
    goodbye,
    hello,
}
