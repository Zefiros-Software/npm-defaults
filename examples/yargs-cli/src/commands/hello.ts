import type { Argv } from 'yargs'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function builder(yargs: Argv) {
    return yargs
        .option('name', {
            describe: 'name to print',
            type: 'string',
            default: 'world',
        })
        .option('force', {
            type: 'boolean',
        })
        .positional('file', {
            type: 'string',
        })
}

export function handler(argv: ReturnType<typeof builder>['argv']): void {
    console.log(`hello ${argv.name} from ./src/commands/hello.ts`)
    if (argv.file && argv.force) {
        console.log(`you input --force and --file: ${argv.file}`)
    }
}

export default {
    command: 'hello [file]',
    describe: 'describe the command here',
    builder,
    handler,
}
