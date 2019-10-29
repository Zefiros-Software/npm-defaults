import { Command, flags } from '@oclif/command'
import fs from 'fs'
import LineDiff from 'line-diff'
import path from 'path'
import vdiff from 'variable-diff'
import { config, packagejson, reloadConfiguration, root } from '~/common/config'
import { getAllFiles } from '~/common/file'
import { PackageType } from '~/common/type'

export class Lint extends Command {
    public static description = 'lint the project configuration'

    public static flags = {
        fix: flags.boolean(),
    }

    public static scripts: Record<PackageType, Record<string, string>> = {
        [PackageType.Common]: {
            ['build']: 'yarn ttsc -p tsconfig.dist.json',
            ['check:types']: 'yarn ttsc -p tsconfig.json',
            ['check:project']: 'yarn npm-defaults lint',
            ['test']: 'yarn check:types && yarn jest test --maxWorkers=1',
            ['fix']: 'yarn lint --fix',
            ['lint']: 'tslint --project tsconfig.json',
            ['package']: 'rm -rf dist && yarn build',
            ['release']: 'yarn semantic-release',
            ['release:dry']: 'yarn release --dry-run',
        },
        [PackageType.Library]: {},
        [PackageType.OclifCli]: {
            ['check:types']: 'yarn ttsc -p tsconfig.lint.json',
            ['lint']: 'tslint --project tsconfig.lint.json',
            ['prepack']:
                'yarn ts-node -r tsconfig-paths/register node_modules/@oclif/dev-cli/bin/run manifest && oclif-dev readme',
            ['postpack']: 'rm -f oclif.manifest.json',
        },
    }

    public args!: ReturnType<Lint['parseArgs']>
    public parseArgs = () => this.parse(Lint)

    public async run() {
        this.args = this.parseArgs()
        this.lintPackage()
        this.lintTemplate()
    }

    public lintTemplate() {
        if (config.skipTemplate) {
            return
        }

        const commonRoot = `${root}/templates/${PackageType.Common}/`
        for (const file of getAllFiles(commonRoot)) {
            const relFile = path.relative(commonRoot, file)
            this.lintFile(`${commonRoot}${relFile}`, relFile)
        }

        if (config.type !== PackageType.Common) {
            const templateRoot = `${root}/templates/${config.type}/`
            for (const file of getAllFiles(templateRoot)) {
                const relFile = path.relative(templateRoot, file)
                this.lintFile(`${templateRoot}${relFile}`, relFile)
            }
        }
    }

    public lintFile(from: string, target: string) {
        const oldContent = fs.existsSync(target) ? fs.readFileSync(target, 'utf-8') : undefined
        const newContent = fs.readFileSync(from, 'utf-8')
        const isDifferent = oldContent !== newContent
        if (isDifferent) {
            if (oldContent) {
                this.warn(`[${target}]:\n${new LineDiff(oldContent, newContent).toString()}`)
            } else {
                this.warn(`[${target}]: file not found`)
            }
            this.fail()

            if (this.args.flags.fix) {
                this.log(`Writing ${target}`)
                const dir = path.dirname(target)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
                fs.writeFileSync(target, newContent)
            }
        }
    }

    public lintPackage() {
        const json = JSON.stringify(packagejson, null, 2)
        this.lintConfiguration()
        this.lintScripts()

        const fixed = JSON.stringify(packagejson, null, 2)
        if (this.args.flags.fix && json !== fixed) {
            fs.writeFileSync(`${process.cwd()}/package.json`, fixed)
            this.log('fixed entries')
        }
    }

    public lintConfiguration() {
        const json = JSON.stringify(packagejson['npm-defaults'] || {})
        if (!packagejson['npm-defaults']) {
            packagejson['npm-defaults'] = {
                type: PackageType.Library,
            }
        }
        if (JSON.stringify(packagejson['npm-defaults']) !== json) {
            this.warn(
                `[package.json>npm-defaults] missing or outdated configuration:\n${
                    vdiff(JSON.parse(json), packagejson['npm-defaults']).text
                }`
            )

            this.fail()
        }
        reloadConfiguration()
    }

    public lintScripts() {
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
                    vdiff(JSON.parse(json), packagejson.scripts).text
                }`
            )

            this.fail()
        }
    }

    public fail() {
        if (!this.args.flags.fix) {
            this.error('Found errors in the project')
            this.exit(1)
        }
    }
}

export default Lint
