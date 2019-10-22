import { Command, flags } from '@oclif/command'

export default class Goodbye extends Command {
    public static description = 'describe the command here'

    public static flags = {
        help: flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        name: flags.string({ char: 'n', description: 'name to print' }),
        // flag with no value (-f, --force)
        force: flags.boolean({ char: 'f' }),
    }

    public static args = [{ name: 'file' }]

    public async run() {
        const { args, flags: lflags } = this.parse(Goodbye)

        const name = lflags.name || 'world'
        this.log(`hello ${name} from /root/cli/tmp/examples/example-multi-ts/src/commands/goodbye.ts`)
        if (args.file && lflags.force) {
            this.log(`you input --force and --file: ${args.file}`)
        }
    }
}