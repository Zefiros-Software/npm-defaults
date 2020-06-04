import { lintDirectory } from '~/commands/lint'

import execa from 'execa'
import concurrently from 'concurrently'

import { cpus } from 'os'

export const commands = [['lint', 'build', 'check:types'], 'coverage']

export async function runCommand(command: string | string[], allowParallel = true): Promise<void> {
    if (allowParallel && Array.isArray(command)) {
        const codes = await concurrently(command.map((c) => `yarn ${c}`, {
            maxProcesses: cpus().length
        }))
        console.log(`Exited with codes ${codes}`)
    } else {

        const subcommands =( Array.isArray(command) ? command : [command])
        for (const subcommand of subcommands) {
            console.log(`$ yarn ${subcommand}`)
            const subprocess = execa('yarn', [subcommand])
    
            subprocess.stderr!.pipe(process.stderr)
            subprocess.stdout!.pipe(process.stdout)
            const { exitCode } = await subprocess
            console.log(`Exited with code ${exitCode}`)
        }
    }
}

export async function handler() {
    await lintDirectory()

    await runCommand('install', false)
    for (const command of commands) {
        await runCommand(command)
    }
}

export default {
    command: 'ci',
    describe: 'run all ci tests',
    handler,
}
