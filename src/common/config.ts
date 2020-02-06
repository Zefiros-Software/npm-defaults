import fs from 'fs'
import { Package } from 'normalize-package-data'
import path from 'path'
import { PackageType } from '~/common/type'

// eslint-disable-next-line prefer-const
export let configurationKey = 'npm-defaults'

export interface NpmDefaultsConfiguration {
    type: PackageType
    skipTemplate?: boolean
}

export const packagejson: Package & {
    ['npm-defaults']: NpmDefaultsConfiguration
} = {
    ...(fs.existsSync(`${process.cwd()}/package.json`) ? require(`${process.cwd()}/package.json`) : {}),
}

export let config: typeof packagejson['npm-defaults'] | undefined = packagejson[configurationKey]

export function reloadConfiguration() {
    config = packagejson[configurationKey]
}

export function setConfigurationKey(key: string) {
    configurationKey = key
}

export const root = path.resolve(__dirname, '../../')
