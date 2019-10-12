import { Command } from '@oclif/command'
import execa from 'execa'
import Lint from '~/commands/lint'

export default class CI extends Command {
    public static description = 'describe the command here'

    public async run() {
        await Lint.run([])
        await this.runCommand('install')
        await this.runCommand('lint')
        await this.runCommand('build')
        await this.runCommand('test')
    }

    public async runCommand(command: string) {
        const subprocess = execa('yarn', [command])
        subprocess.stdout!.pipe(process.stdout)
        await subprocess
    }
}
