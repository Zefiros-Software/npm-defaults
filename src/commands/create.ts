import { Command } from '@oclif/command'
import path from 'path'
import copy from 'recursive-copy'
import { root } from '~/common/config'
import { PackageType } from '~/common/type'

export interface CreateArgs {
    type: PackageType.Library | PackageType.OclifCli
    name: string
}

export class Create extends Command {
    public static description = 'run all ci tests'

    public static args: typeof Command['args'] = [
        {
            name: 'type',
            required: true,
            description: 'the package type',
            default: PackageType.Library,
            options: [PackageType.Library, PackageType.OclifCli],
        },
        {
            name: 'name',
            required: true,
            description: 'the package name',
        },
    ]

    public static roots: Record<string, string> = {
        [PackageType.Library]: root,
        [PackageType.OclifCli]: root,
    }
    public args!: ReturnType<Create['parseArgs']>
    public parseArgs = () => this.parse(Create)
    public _roots!: typeof Create.roots

    public async run() {
        this._roots = (this.constructor as any).roots ?? Create.roots
        this.args = this.parseArgs()

        const targetDir = path.resolve(process.cwd(), this.args.args.name)
        this.log(`creating ${this.args.args.type} in ${targetDir}`)

        await copy(`${this._roots[this.args.args.type]}/examples/${this.args.args.type}`, targetDir, {
            dot: true,
            overwrite: true,
            filter: [
                '**/*',
                '!node_modules{/**,}',
                '!coverage{/**,}',
                '!dist{/**,}',
                '!dist',
                '!yarn.lock',
                '!yarn-error.log',
                '!.yalc{/**,}',
                '!yalc.lock',
            ],
        })
    }
}

export default Create
