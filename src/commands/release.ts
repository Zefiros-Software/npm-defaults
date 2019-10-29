import * as github from '@actions/github'
import { Command } from '@oclif/command'
import execa from 'execa'

export class Release extends Command {
    public static description = 'release the package (standard-release)'
    public context = github.context

    public async run() {
        const { version } = require(`${process.cwd()}/package.json`)
        this.log(`Creating release pull request for version ${version}`)

        const subprocess = execa('yarn', ['release'], {
            extendEnv: true,
            env: {
                GIT_AUTHOR_NAME: 'Hoid',
                GIT_COMMITTER_NAME: 'Hoid',
                GIT_AUTHOR_EMAIL: 'hoid@zefiros.io',
                GIT_COMMITTER_EMAIL: 'hoid@zefiros.io',
            },
        })
        try {
            subprocess.stderr!.pipe(process.stderr)
            subprocess.stdout!.pipe(process.stdout)
            const { stdout, stderr, exitCode, failed } = await subprocess
            this.log(stdout)
            if (stderr && failed) {
                this.warn(stderr)
            }
            this.log(`Exited with code ${exitCode}`)
        } catch (error) {
            this.error(error)
        }
    }
}

export default Release
