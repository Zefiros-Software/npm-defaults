import { PackageType } from '~/common/type'

import findRoot from 'find-root'

import fs from 'fs'

export let configurationKey = 'npm-defaults'

export interface NpmDefaultsConfiguration {
    type: PackageType
    template?: {
        exclude?: string[]
        ignore?: {
            files?: boolean
            dependencies?: boolean
            devDependencies?: boolean
            script?: boolean
            packageDefinition?: boolean
        }
    }
}

export const packagejson = {
    ...(fs.existsSync(`${process.cwd()}/package.json`)
        ? JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`).toString())
        : {}),
} as Record<string, unknown> & {
    version: string
    scripts: Record<string, string> | undefined
    dependencies: Record<string, string> | undefined
    devDependencies: Record<string, string> | undefined
    files: string[] | undefined
    ['npm-defaults']: NpmDefaultsConfiguration | undefined
}

export let config: typeof packagejson['npm-defaults'] | undefined = packagejson[
    configurationKey
] as typeof packagejson['npm-defaults']

export function reloadConfiguration(): void {
    config = packagejson[configurationKey] as typeof config
}

export function setConfigurationKey(key: string): void {
    configurationKey = key
}

export const root = findRoot(__dirname)
