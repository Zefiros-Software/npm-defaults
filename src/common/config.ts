import fs from 'fs'
import { Package } from 'normalize-package-data'
import path from 'path'
import { PackageType } from '~/common/type'

export interface NpmDefaultsConfiguration {
    type: PackageType
    skipTemplate?: boolean
}

export const packagejson: Package & {
    ['npm-defaults']: NpmDefaultsConfiguration
} = {
    // tslint:disable-next-line: no-var-requires
    ...(fs.existsSync(`${process.cwd()}/package.json`) ? require(`${process.cwd()}/package.json`) : {}),
}

export let config = packagejson['npm-defaults']

export function reloadConfiguration() {
    config = packagejson['npm-defaults']
}

export const root = path.resolve(__dirname, '../../')
