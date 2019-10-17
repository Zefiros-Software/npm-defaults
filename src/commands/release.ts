import * as github from '@actions/github'
import { Command } from '@oclif/command'
import execa from 'execa'

export default class PullRequest extends Command {
    public static description = 'describe the command here'
    public context = github.context

    public async run() {
        const { version } = require(`${process.cwd()}/package.json`)
        this.log(`Creating release pull request for version ${version}`)

        const subprocess = execa('yarn', ['release', '--dry'], {
            extendEnv: true,
            env: {
                GIT_AUTHOR_NAME: 'Hoid',
                GIT_COMMITTER_NAME: 'Hoid',
                GIT_AUTHOR_EMAIL: 'hoid@zefiros.io',
                GIT_COMMITTER_EMAIL: 'hoid@zefiros.io',
            },
        })
        subprocess.stdout!.pipe(process.stdout)
        const { stdout } = await subprocess
        this.log(stdout)
    }
}
