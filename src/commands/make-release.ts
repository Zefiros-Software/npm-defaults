import * as core from '@actions/core'
import * as github from '@actions/github'
import { Command } from '@oclif/command'

export default class PullRequest extends Command {
    public static description = 'describe the command here'
    public token = process.env.GITHUB_TOKEN!
    public octokit = new github.GitHub(this.token)
    public context = github.context

    public async run() {
        const { version } = require(`${process.cwd()}/package.json`)
        this.log(`Creating release pull request for version ${version} ${this.token}`)
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
                    pull_number: pullNumber,
                })
            }
        }
    }
}
