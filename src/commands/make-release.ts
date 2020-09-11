import { packagejson } from '~/common/config'

import { createActionAuth } from '@octokit/auth-action'
import { Octokit } from '@octokit/rest'

import { existsSync, readFileSync } from 'fs'
import { EOL } from 'os'

export interface Repo {
    owner: string
    repo: string
}

export function getRepo(): Repo {
    if (process.env.GITHUB_REPOSITORY !== undefined) {
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
        return { owner, repo }
    }
    let payload: unknown & { repository?: { owner: { login: string }; name: string } } = {}
    if (process.env.GITHUB_EVENT_PATH !== undefined) {
        if (existsSync(process.env.GITHUB_EVENT_PATH)) {
            payload = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })) as typeof payload
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

export async function makePullRequest(octokit: Octokit, repo: Readonly<Repo>, version: string): Promise<void> {
    await octokit.pulls.create({
        ...repo,
        title: `Publish version ${version}`,
        head: 'development',
        base: 'master',
        draft: true,
    })
}

export async function updatePullRequest(octokit: Octokit, repo: Readonly<Repo>, version: string): Promise<void> {
    const existing = await octokit.pulls.list({
        ...repo,
        state: 'open',
        head: `${repo.owner}:development`,
        base: 'master',
    })
    if (existing.data.length > 0) {
        const pullNumber = existing.data[0].number
        await octokit.pulls.update({
            ...repo,
            title: `Publish version ${version}`,
            pull_number: pullNumber,
        })
    }
}

export async function handler(): Promise<void> {
    const octokit = new Octokit({
        authStrategy: createActionAuth,
    })
    const { version } = packagejson
    const repo = getRepo()
    console.log(`Creating release pull request for version ${version}`)
    try {
        await makePullRequest(octokit, repo, version)
    } catch (error) {
        console.log(`A pull request already exists, updating the old one:\n${error as string}`)
        await updatePullRequest(octokit, repo, version)
    }
}

export default {
    command: 'make-release',
    describe: 'create a pull request to release to stable',
    handler,
}
