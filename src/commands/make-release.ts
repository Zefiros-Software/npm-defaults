import { Octokit } from '@octokit/action'
import { Command } from '@oclif/command'
import { packagejson } from '~/common/config'
import { existsSync, readFileSync } from 'fs'
import { EOL } from 'os'

export class MakeRelease extends Command {
    public static description = 'create a pull request to release to stable'
    public octokit = new Octokit()

    public async run() {
        const { version } = packagejson
        this.log(`Creating release pull request for version ${version}`)
        try {
            await this.octokit.pulls.create({
                ...this.repo,
                title: `Publish version ${version}`,
                head: 'development',
                base: 'master',
                draft: true,
            })
        } catch (error) {
            this.log(`A pull request already exists, updating the old one:\n${error}`)
            const existing = await this.octokit.pulls.list({
                ...this.repo,
                state: 'open',
                head: 'Zefiros-Software:development',
                base: 'master',
            })
            if (existing.data.length > 0) {
                const pullNumber = existing.data[0].number
                await this.octokit.pulls.update({
                    ...this.repo,
                    title: `Publish version ${version}`,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    pull_number: pullNumber,
                })
            }
        }
    }

    public get repo(): { owner: string; repo: string } {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
            return { owner, repo }
        }
        let payload: any = {}
        if (process.env.GITHUB_EVENT_PATH) {
            if (existsSync(process.env.GITHUB_EVENT_PATH)) {
                payload = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }))
            } else {
                const path = process.env.GITHUB_EVENT_PATH
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${EOL}`)
            }
        }

        if (payload.repository) {
            return {
                owner: payload.repository.owner.login,
                repo: payload.repository.name,
            }
        }

        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'")
    }
}

export default MakeRelease
