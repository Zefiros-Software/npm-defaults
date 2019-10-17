import { Command, flags } from '@oclif/command'
import fs from 'fs'
import diff from 'variable-diff'
import { config, packagejson, reloadConfiguration } from '~/common/config'
import { PackageType } from '~/common/type'

export default class Lint extends Command {
    public static description = 'describe the command here'

    public static flags = {
        fix: flags.boolean(),
    }

    public static scripts: Record<PackageType, Record<string, string>> = {
        [PackageType.Common]: {
            ['build']: 'yarn ttsc -p tsconfig.dist.json',
            ['test']: 'yarn ttsc -p tsconfig.json && jest test',
            ['fix']: 'yarn lint --fix',
            ['lint']: 'tslint --project tsconfig.json',
            ['release']: 'yarn semantic-release',
            ['release:dry']: 'yarn release --dry-run',
        },
        [PackageType.Library]: {},
        [PackageType.OclifCli]: {
            ['lint']: 'tslint --project tsconfig.lint.json',
            ['test']: 'yarn ttsc -p tsconfig.lint.json && jest test',
        },
    }

    public args!: ReturnType<Lint['parseArgs']>
    public parseArgs = () => this.parse(Lint)

    public async run() {
        this.args = this.parseArgs()
        await this.lintPackage()
    }

    public async lintPackage() {
        const json = JSON.stringify(packagejson, null, 2)
        await this.lintConfiguration()
        await this.lintScripts()

        const fixed = JSON.stringify(packagejson, null, 2)
        if (this.args.flags.fix && json !== fixed) {
            fs.writeFileSync(`${process.cwd()}/package.json`, fixed)
            this.log('fixed entries')
        }
    }

    public async lintConfiguration() {
        const json = JSON.stringify(packagejson['npm-defaults'] || {})
        if (!packagejson['npm-defaults']) {
            packagejson['npm-defaults'] = {
                type: PackageType.Library,
            }
        }
        if (JSON.stringify(packagejson['npm-defaults']) !== json) {
            this.warn(
                `[package.json>npm-defaults] missing or outdated configuration:\n${
                    diff(JSON.parse(json), packagejson['npm-defaults']).text
                }`
            )

            this.fail()
        }
        reloadConfiguration()
    }

    public async lintScripts() {
        if (!packagejson.scripts) {
            packagejson.scripts = {}
        }
        const json = JSON.stringify(packagejson.scripts)
        for (const [entry, value] of Object.entries(Lint.scripts[PackageType.Common])) {
            packagejson.scripts[entry] = value
        }
        for (const [entry, value] of Object.entries(Lint.scripts[config.type] || {})) {
            packagejson.scripts[entry] = value
        }
        if (JSON.stringify(packagejson.scripts) !== json) {
            this.warn(
                `[package.json>scripts] missing or outdated script entries found:\n${
                    diff(JSON.parse(json), packagejson.scripts).text
                }`
            )

            this.fail()
        }
    }

    public fail() {
        if (!this.args.flags.fix) {
            this.exit(1)
        }
    }
}
