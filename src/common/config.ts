/* eslint-disable @typescript-eslint/camelcase */
import fs from 'fs'
import { Package } from 'normalize-package-data'
import { PackageType } from '~/common/type'
import findRoot from 'find-root'

// eslint-disable-next-line prefer-const
export let configurationKey = 'npm-defaults'

export interface NpmDefaultsConfiguration {
    type: PackageType
    skipTemplate?: boolean
}

export const packagejson: Package & {
    ['npm-defaults']: NpmDefaultsConfiguration
} = {
    ...(fs.existsSync(`${process.cwd()}/package.json`)
        ? JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`).toString())
        : {}),
}

export let config: typeof packagejson['npm-defaults'] | undefined = packagejson[configurationKey]

export function reloadConfiguration() {
    config = packagejson[configurationKey]
}

export function setConfigurationKey(key: string) {
    configurationKey = key
}

export const root = findRoot(__dirname)
