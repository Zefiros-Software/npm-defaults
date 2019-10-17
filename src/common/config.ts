import { Package } from 'normalize-package-data'
import { PackageType } from '~/common/type'

export interface NpmDefaultsConfiguration {
    type: PackageType
}

export const packagejson: Package & {
    ['npm-defaults']: NpmDefaultsConfiguration
} = {
    // tslint:disable-next-line: no-var-requires
    ...require(`${process.cwd()}/package.json`),
}

export let config = packagejson['npm-defaults']

export function reloadConfiguration() {
    config = packagejson['npm-defaults']
}
