import * as github from '@actions/github'
import { Command } from '@oclif/command'
import { packagejson } from '~/common/config'

export class MakeRelease extends Command {
    public static description = 'create a pull request to release to stable'
    public token = process.env.GITHUB_TOKEN!
    public octokit = new github.GitHub(this.token)
    public context = github.context

    public async run() {
        const { version } = packagejson
        this.log(`Creating release pull request for version ${version}`)
        try {
            await this.octokit.pulls.create({
                ...this.context.repo,
                title: `Publish version ${version}`,
                head: 'development',
                base: 'master',
                draft: true,
            })
        } catch (error) {
            this.log(`A pull request already exists, updating the old one`)
            const existing = await this.octokit.pulls.list({
                ...this.context.repo,
                state: 'open',
                head: 'Zefiros-Software:development',
                base: 'master',
            })
            if (existing.data.length > 0) {
                const pullNumber = existing.data[0].number
                await this.octokit.pulls.update({
                    ...this.context.repo,
                    title: `Publish version ${version}`,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    pull_number: pullNumber,
                })
            }
        }
    }
}

export default MakeRelease
