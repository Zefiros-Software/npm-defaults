import { packagejson } from '~/common/config'

import execa from 'execa'

export async function createRelease(): Promise<execa.ExecaReturnValue<string>> {
    const subprocess = execa('yarn', ['release'], {
        extendEnv: true,
        env: {
            GIT_AUTHOR_NAME: 'Hoid',
            GIT_COMMITTER_NAME: 'Hoid',
            GIT_AUTHOR_EMAIL: 'hoid@zefiros.io',
            GIT_COMMITTER_EMAIL: 'hoid@zefiros.io',
        },
    })
    subprocess.stderr!.pipe(process.stderr)
    subprocess.stdout!.pipe(process.stdout)
    return await subprocess
}

export async function handler(): Promise<void> {
    console.log(`Creating release pull request for version ${packagejson.version}`)
    try {
        const { exitCode } = await createRelease()

        console.log(`Exited with code ${exitCode}`)
    } catch (error) {
        console.error(error)
    }
}

export default {
    command: 'release',
    describe: 'release the package (standard-release)',
    handler,
}
