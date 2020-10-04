import { root } from '~/common/config'
import { PackageType } from '~/common/type'
import { gitignore } from '~/common/ignore'

import type { Argv } from 'yargs'
import pLimit from 'p-limit'
import { JSZip, walkZip, findZipFolder } from '@zefiros/jszip-slim'
import glob from 'picomatch'
import execa from 'execa'

import path from 'path'
import fs from 'fs'
import https from 'https'

export const projectRoots: Record<string, string> = {
    [PackageType.Library]: root,
    [PackageType.YargsCli]: root,
}

function httpsGet(url: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const req = https.get(url, (response): void => {
            void (async () => {
                const chunks: Buffer[] = []
                try {
                    for await (const chunk of response[Symbol.asyncIterator]()) {
                        chunks.push(Buffer.from(chunk))
                    }
                } catch (err) {
                    reject(err)
                }
                if (response.headers.location !== undefined) {
                    return httpsGet(response.headers.location).then(resolve).catch(reject)
                }
                return resolve(Buffer.concat(chunks))
            })()
        })
        req.on('error', reject)
    })
}

/* eslint-disable */
const {
    version,
    repository: { url: gitUrl },
}: { version: string; repository: { url: string } } = require('../../package.json')
/* eslint-enable */

const [, repositoryUrl] = /(https:\/\/.*?)(?:\.git)?$/.exec(gitUrl) ?? []
export async function createProject(type: string, name: string): Promise<void> {
    const targetDir = path.resolve(process.cwd(), name)
    console.log(`creating ${type} in ${targetDir}`)
    await execa('git', ['init', targetDir])

    const artifact = findZipFolder(
        await JSZip.loadAsync(await httpsGet(`${repositoryUrl}/archive/v${version}.zip`)),
        'examples'
    )?.folder(type)

    const ignorePatterns = glob(gitignore((await artifact?.file('.gitignore')?.async('string')) ?? ''))
    const entries = [...walkZip(artifact)].filter(([subPath]) => !ignorePatterns(subPath))
    const limit = pLimit(255)

    await Promise.allSettled(
        entries
            .filter(([, { dir: isDir }]) => isDir)
            .map(async ([subPath]) => {
                await fs.promises.mkdir(path.join(targetDir, subPath), { recursive: true })
            })
    )

    await Promise.allSettled(
        entries
            .filter(([, { dir: isDir }]) => !isDir)
            .map(([subPath, file]) =>
                file.dir
                    ? undefined
                    : limit(async () => {
                          await fs.promises.writeFile(path.join(targetDir, subPath), await file.async('nodebuffer'))
                          if (/\/bin\//.test(subPath)) {
                              await execa('chmod', ['+x', path.join(targetDir, subPath)], { stdio: 'inherit' })
                          }
                      })
            )
    )
}

export function builder(yargs: Argv) {
    return yargs
        .option('type', {
            describe: 'package type',
            type: 'string',
            default: PackageType.Library,
            choices: [PackageType.Library, PackageType.YargsCli],
            demand: true,
        })
        .positional('name', {
            describe: 'the new package name',
            type: 'string',
            required: true,
        })
}

export async function handler(argv: ReturnType<typeof builder>['argv']): Promise<void> {
    await createProject(argv.type, argv.name!)
}

export default {
    command: 'create <name>',
    describe: 'create a new project',
    builder,
    handler,
}
