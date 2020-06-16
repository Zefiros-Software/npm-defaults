// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { bin } from '../package.json'

import goodbye from '~/commands/goodbye'
import hello from '~/commands/hello'

import yargs from 'yargs'


export async function run() {
    return yargs.scriptName(Object.keys(bin)[0]).command(goodbye).command(hello).help().argv
}

export default {
    goodbye,
    hello,
}
