import { Command } from '@oclif/command'
import execa from 'execa'
import { packagejson } from '~/common/config'

export class Release extends Command {
    public static description = 'release the package (standard-release)'

    public async run() {
        const { version } = packagejson
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
            const { exitCode } = await subprocess
            this.log(`Exited with code ${exitCode}`)
        } catch (error) {
            this.error(error)
        }
    }
}

export default Release
