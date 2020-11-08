import { lintDirectory } from '~/commands/lint'

import execa from 'execa'
import concurrently from 'concurrently'

import { cpus } from 'os'

type Command =
    | {
          run: string
      }
    | {
          args: string[]
      }
    | string

function isScriptCommand(c: Command): c is { run: string } {
    return (c as { run?: string }).run !== undefined
}

function isComplexCommand(c: Command): c is { args: string[] } {
    return (c as { args?: string[] }).args !== undefined
}

export const commands: (Command | Command[])[] = [
    [{ run: 'lint' }, { run: 'build' }, { run: 'check:types' }],
    { run: 'coverage' },
]

export async function runCommand(command: Command | Command[], allowParallel = true): Promise<void> {
    if (allowParallel && Array.isArray(command)) {
        const codes = await concurrently(
            command.map(
                (c: Command) =>
                    isScriptCommand(c) ? `npm run ${c.run}` : isComplexCommand(c) ? `npm ${c.args.join(' ')}` : `npm ${c}`,
                {
                    maxProcesses: cpus().length,
                }
            )
        )
        console.log(`Exited with codes ${codes ?? ''}`)
    } else {
        const subcommands = Array.isArray(command) ? command : [command]
        for (const subcommand of subcommands) {
            const command = isScriptCommand(subcommand)
                ? ['run', subcommand.run]
                : isComplexCommand(subcommand)
                ? subcommand.args
                : [subcommand]
            console.log(`$ npm ${command.join(' ')}`)
            const subprocess = execa('npm', command)

            subprocess.stderr!.pipe(process.stderr)
            subprocess.stdout!.pipe(process.stdout)
            const { exitCode } = await subprocess
            console.log(`Exited with code ${exitCode}`)
        }
    }
}

export async function handler(): Promise<void> {
    lintDirectory()

    await runCommand({ args: ['install'] }, false)
    for (const command of commands) {
        await runCommand(command)
    }
}

export default {
    command: 'ci',
    describe: 'run all ci tests',
    handler,
}
