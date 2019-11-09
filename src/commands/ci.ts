import { Command } from '@oclif/command'
import execa from 'execa'
import Lint from '~/commands/lint'

export class CI extends Command {
    public static description = 'run all ci tests'

    public commands = [[...(this.isCI() ? ['install', '--frozen-lockfile'] : ['install'])], 'lint', 'build', 'test']

    public async run() {
        await Lint.run([])
        for (const command of this.commands) {
            await this.runCommand(command)
        }
    }

    public async runCommand(command: string | string[]) {
        const subprocess = execa('yarn', Array.isArray(command) ? command : [command])
        subprocess.stderr!.pipe(process.stderr)
        subprocess.stdout!.pipe(process.stdout)
        const { exitCode } = await subprocess
        this.log(`Exited with code ${exitCode}`)
    }

    public isCI(): boolean {
        return process.env.CI !== undefined
    }
}

export default CI
