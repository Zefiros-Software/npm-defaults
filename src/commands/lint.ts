import { Command, flags } from '@oclif/command'
import fs from 'fs'
import { Package } from 'normalize-package-data'
import diff from 'variable-diff'

export default class Lint extends Command {
    public static description = 'describe the command here'

    public static flags = {
        fix: flags.boolean(),
    }

    public static scripts = {
        ['build']: 'yarn ttsc -p tsconfig.dist.json',
        ['test']: 'yarn ttsc -p tsconfig.lint.json && jest test',
        ['fix']: 'yarn lint --fix',
        ['lint']: 'tslint --project tsconfig.lint.json',
        ['release']: 'yarn semantic-release',
        ['release:dry']: 'yarn release --dry-run',
    }

    public async run() {
        const { flags: lflags } = this.parse(Lint)
        await this.lintPackage(lflags.fix)
    }

    public async lintPackage(fix: boolean) {
        const pkg: Package = require(`${process.cwd()}/package.json`)

        await this.lintScripts(pkg)

        if (fix) {
            fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pkg, null, 2))
            this.log('fixed entries')
        }
    }

    public async lintScripts(pkg: Package) {
        if (!pkg.scripts) {
            pkg.scripts = {}
        }
        const json = JSON.stringify(pkg.scripts)
        for (const [entry] of Object.entries({ ...pkg.scripts, ...Lint.scripts })) {
            switch (entry) {
                case 'build':
                    pkg.scripts[entry] = 'yarn ttsc -p tsconfig.dist.json'
                    break
                case 'test':
                    pkg.scripts[entry] = 'yarn ttsc -p tsconfig.lint.json && jest test'
                    break
                case 'fix':
                    pkg.scripts[entry] = 'yarn lint --fix'
                    break
                case 'lint':
                    pkg.scripts[entry] = 'tslint --project tsconfig.lint.json'
                    break
                case 'release':
                    pkg.scripts[entry] = 'yarn semantic-release'
                    break
                case 'release:dry':
                    pkg.scripts[entry] = 'yarn release --dry-run'
                    break
                default:
                    break
            }
        }
        if (JSON.stringify(pkg.scripts) !== json) {
            this.warn(`missing or outdated script entries found:\n${diff(pkg.scripts, JSON.parse(json)).text}`)

            this.exit(1)
        }
    }
}
