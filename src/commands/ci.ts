import { Command } from '@oclif/command'
import execa from 'execa'
import Lint from '~/commands/lint'
import { config } from '~/common/config'
import { PackageType } from '~/common/type'

export class CI extends Command {
    public static description = 'run all ci tests'

    public static shouldLock: Record<string, boolean> = {
        [PackageType.OclifCli]: true,
    }

    public commands = [[...(this.isCI ? ['install', '--frozen-lockfile'] : ['install'])], 'lint', 'build', 'test']
    public _shouldLock!: typeof CI.shouldLock

    public async run() {
        this._shouldLock = (this.constructor as any).shouldLock ?? CI.shouldLock
        await this.lint()
        for (const command of this.commands) {
            await this.runCommand(command)
        }
    }

    public async lint() {
        return Lint.run([])
    }

    public async runCommand(command: string | string[]) {
        this.log(`$ yarn ${Array.isArray(command) ? command.join(' ') : command}`)
        const subprocess = execa('yarn', Array.isArray(command) ? command : [command])
        subprocess.stderr!.pipe(process.stderr)
        subprocess.stdout!.pipe(process.stdout)
        const { exitCode } = await subprocess
        this.log(`Exited with code ${exitCode}`)
    }

    public get lockfile(): boolean {
        return this.isCI && this.type ? this._shouldLock[this.type] ?? false : false
    }

    public get isCI(): boolean {
        return process.env.CI !== undefined
    }

    public get type(): string | undefined {
        return config?.type
    }
}

export default CI
