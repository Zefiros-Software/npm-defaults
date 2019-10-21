import { Command } from '@oclif/command'
import path from 'path'
import copy from 'recursive-copy'
import { root } from '~/common/config'
import { PackageType } from '~/common/type'

export interface CreateArgs {
    type: PackageType.Library | PackageType.OclifCli
    name: string
}

export default class Create extends Command {
    public static description = 'run all ci tests'

    public static args = [
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

    public async run() {
        const { args: largs } = this.parse<{}, CreateArgs>(Create)

        const targetDir = path.resolve(process.cwd(), largs.name)
        this.log(`creating ${largs.type} in ${targetDir}`)

        await copy(`${root}/examples/${largs.type}`, targetDir, {
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
