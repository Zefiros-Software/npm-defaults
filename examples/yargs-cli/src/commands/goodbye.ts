import type { Argv } from 'yargs'

export function builder(yargs: Argv) {
    return yargs
        .option('name', {
            describe: 'name to print',
            type: 'string',
            default: 'world',
        })
        .positional('file', {})
}

export async function handler(argv: ReturnType<typeof builder>['argv']): Promise<void> {
    console.log(`goodbye ${argv.name} from ./src/commands/goodbye.ts`)
}

export default {
    command: 'goodbye [file]',
    describe: 'describe the command here',
    builder,
    handler,
}
