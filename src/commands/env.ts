import { Command, flags } from '@oclif/command'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import { globalDevDependencies, globalDependencies } from '../../package.json'
import execa from 'execa'

export class Env extends Command {
    public static description = 'provision global environment'
    public static flags = {
        help: flags.help({ char: 'h' }),
        install: flags.boolean({
            default: false,
            description: 'install the environment',
        }),
    }

    public async run() {
        const { flags } = this.parse(Env)
        if (flags.install) {
            await execa(
                'npm',
                [
                    ...[
                        'install',
                        '-g',
                        ...Object.entries(globalDependencies).map(([pkg, version]) => `${pkg}@${version}`),
                        ...Object.entries(globalDevDependencies).map(([pkg, version]) => `${pkg}@${version}`),
                    ],
                ],
                {
                    stdio: 'inherit',
                }
            )
        }
    }
}

export default Env
