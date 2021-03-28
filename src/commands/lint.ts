import { config, packagejson, reloadConfiguration, root, configurationKey } from '~/common/config'
import { getAllFiles } from '~/common/file'
import { PackageType } from '~/common/type'

import vdiff from 'variable-diff'
import LineDiff from 'line-diff'
import type { Argv } from 'yargs'

import path from 'path'
import fs from 'fs'

interface PackageJsonDependencies {
    peerDependencies: Record<string, string>
    devDependencies: Record<string, string>
    dependencies: Record<string, string>
}

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { peerDependencies, devDependencies, dependencies }: PackageJsonDependencies = require('../../package.json')

export const scripts: Record<string, Record<string, string> | undefined> = {
    [PackageType.Common]: {
        ['build']: 'npx webpack --version && npx webpack',
        ['check:cost']: 'npx cost-of-modules --no-install --include-dev',
        ['check:types']: 'npx tsc -p tsconfig.json',
        ['check:project']: 'npx npm-defaults lint',
        ['test']: 'npx concurrently "npm run check:types" "npx jest"',
        ['coverage']: 'jest --collectCoverage=true',
        ['fix']: 'npm run lint --fix',
        ['lint']:
            'npx eslint "{src,test,typing}/**/*.{ts,js}" --no-eslintrc -c .eslintrc.js --ignore-path .gitignore --resolve-plugins-relative-to .',
        ['lint:full']: 'bash -c "FULL_LINT=true npm run lint"',
        ['format']: 'npx prettier "**/*.{ts,js,json,yml,yaml}" --ignore-path .gitignore --write',
        ['package']: 'rm -rf dist && npm run build',
        ['release']: 'npx semantic-release',
        ['release:dry']: 'npm run release --dry-run',
    },
    [PackageType.Library]: {},
    [PackageType.YargsCli]: {},
}

export const files: Record<string, string[] | undefined> = {
    [PackageType.Library]: ['dist', 'package.json'],
    [PackageType.YargsCli]: ['bin', 'dist', 'package.json'],
}

export const packageDependencies: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        tslib: devDependencies['tslib'],
    },
    [PackageType.Library]: {},
    [PackageType.YargsCli]: {
        tslib: undefined,
    },
}

export const packageDevDependencies: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        ...peerDependencies,
        typescript: devDependencies['typescript'],
    },
    [PackageType.Library]: {},
    [PackageType.YargsCli]: {
        '@types/source-map-support': devDependencies['@types/source-map-support'],
        'source-map-support': devDependencies['source-map-support'],
        'tsconfig-paths': devDependencies['tsconfig-paths'],
        tslib: devDependencies['tslib'],
        yargs: devDependencies['yargs'],
    },
}

export const packageDefinition: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        node: '>=12',
    },
    [PackageType.Library]: {
        main: './dist/main.js',
        types: './dist/index.d.ts',
    },
    [PackageType.YargsCli]: {
        main: './dist/main.js',
        types: './dist/index.d.ts',
    },
}

export const links: Record<string, string[] | undefined> = {
    [PackageType.Library]: [PackageType.Common],
    [PackageType.YargsCli]: [PackageType.Common],
}

export const roots: Record<string, string[] | undefined> = {
    [PackageType.Common]: [root],
    [PackageType.Library]: [root],
    [PackageType.YargsCli]: [root],
}

export interface LintOptions {
    dependencies: typeof packageDependencies
    devDependencies: typeof packageDevDependencies
    scripts: typeof scripts
    files: typeof files
    packageDefinition: typeof packageDefinition
    links: typeof links
    roots: typeof roots
    fix: boolean
}

interface LintState {
    options: LintOptions
    shouldFail: boolean
}

export function lintTemplate(state: LintState): void {
    if (!config) {
        return
    }
    const targets: Record<string, () => void | undefined> = {}

    if (config.type !== PackageType.Common) {
        for (const root of getRoot(state.options, config.type)) {
            const templateRoot = `${root}/templates/${config.type}/`
            if (!fs.existsSync(templateRoot)) {
                continue
            }
            for (const file of getAllFiles(templateRoot)) {
                const relFile = path.relative(templateRoot, file).replace(/\\/g, '/')
                if (targets[relFile] === undefined && !config.template?.exclude?.includes(relFile)) {
                    targets[relFile] = () => lintFile(state, `${templateRoot}${relFile}`, relFile)
                }
            }
        }
    }

    for (const other of getLinks(state.options)) {
        for (const root of getRoot(state.options, other)) {
            const otherRoot = `${root}/templates/${other}/`
            if (!fs.existsSync(otherRoot)) {
                continue
            }
            for (const file of getAllFiles(otherRoot)) {
                const relFile = path.relative(otherRoot, file).replace(/\\/g, '/')
                if (targets[relFile] === undefined && !config.template?.exclude?.includes(relFile)) {
                    targets[relFile] = () => lintFile(state, `${otherRoot}${relFile}`, relFile)
                }
            }
        }
    }

    for (const target of Object.values(targets)) {
        target()
    }
}

export function lintFile(state: LintState, from: string, target: string): void {
    const oldContent = fs.existsSync(target) ? fs.readFileSync(target, 'utf-8') : undefined
    const newContent = fs.readFileSync(from, 'utf-8')
    const isDifferent = oldContent !== newContent
    if (isDifferent) {
        if (oldContent !== undefined) {
            console.warn(`[${target}]:\n${new LineDiff(oldContent, newContent).toString()}`)
        } else {
            console.warn(`[${target}]: file not found`)
        }
        fail(state)

        if (state.options.fix) {
            console.log(`Writing ${target}`)
            const dir = path.dirname(target)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            fs.writeFileSync(target, newContent)
        }
    }
}

export function lintPackage(state: LintState): void {
    const json = JSON.stringify(packagejson, null, 2)
    lintConfiguration(state)
    linDefinition(state)
    lintScripts(state)
    lintPackageFiles(state)
    lintDependencies(state)
    lintDevDependencies(state)

    const fixed = JSON.stringify(packagejson, null, 2)
    if (state.options.fix && json !== fixed) {
        fs.writeFileSync(`${process.cwd()}/package.json`, fixed)
        console.log('fixed entries')
    }
}

export function lintConfiguration(state: LintState): void {
    const json = JSON.stringify(packagejson[configurationKey] ?? {})
    if (packagejson[configurationKey] === undefined) {
        packagejson[configurationKey] = {
            type: PackageType.Library,
        }
    }
    if (JSON.stringify(packagejson[configurationKey]) !== json) {
        console.warn(
            `[package.json>${configurationKey}] missing or outdated configuration:\n${
                vdiff(JSON.parse(json), packagejson[configurationKey]).text
            }`
        )

        fail(state)
    }
    reloadConfiguration()
}

export function lintScripts(state: LintState): void {
    if (config?.template?.ignore?.script) {
        return
    }
    if (!packagejson.scripts) {
        packagejson.scripts = {}
    }
    const json = JSON.stringify(packagejson.scripts)
    for (const other of config?.type !== undefined ? state.options.links[config.type] ?? [] : []) {
        const scripts = state.options.scripts[other]
        if (scripts) {
            for (const [entry, value] of Object.entries(scripts)) {
                packagejson.scripts[entry] = value
            }
        }
    }
    for (const [entry, value] of Object.entries(config ? state.options.scripts[config.type] ?? {} : {})) {
        packagejson.scripts[entry] = value
    }
    if (JSON.stringify(packagejson.scripts) !== json) {
        console.warn(
            `[package.json>scripts] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson.scripts).text
            }`
        )

        fail(state)
    }
}
export function lintPackageFiles(state: LintState): void {
    if (config?.template?.ignore?.files) {
        return
    }

    if (!packagejson.files) {
        packagejson.files = []
    }

    const json = JSON.stringify(packagejson.files)

    packagejson.files = config?.type !== undefined ? state.options.files[config.type] ?? [] : []
    if (JSON.stringify(packagejson.files) !== json) {
        console.warn(
            `[package.json>files] missing or outdated files entries found:\n${vdiff(JSON.parse(json), packagejson.files).text}`
        )

        fail(state)
    }
}

export function lintDependencies(state: LintState): void {
    if (config?.template?.ignore?.dependencies) {
        return
    }
    if (!packagejson.dependencies) {
        packagejson.dependencies = {}
    }
    const json = JSON.stringify(packagejson.dependencies)
    for (const other of config?.type !== undefined ? state.options.links[config.type] ?? [] : []) {
        const dependencies = state.options.dependencies[other]
        if (dependencies) {
            for (const [entry, value] of Object.entries(dependencies)) {
                packagejson.dependencies[entry] = value!
            }
        }
    }
    for (const [entry, value] of Object.entries(config ? state.options.dependencies[config.type] ?? {} : {})) {
        packagejson.dependencies[entry] = value!
    }
    if (JSON.stringify(packagejson.dependencies) !== json) {
        console.warn(
            `[package.json>dependencies] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson.dependencies).text
            }`
        )

        fail(state)
    }
}

export function lintDevDependencies(state: LintState): void {
    if (config?.template?.ignore?.devDependencies) {
        return
    }
    if (!packagejson.devDependencies) {
        packagejson.devDependencies = {}
    }
    const json = JSON.stringify(packagejson.devDependencies)
    for (const other of config?.type !== undefined ? state.options.links[config.type] ?? [] : []) {
        const devDependencies = state.options.devDependencies[other]
        if (devDependencies) {
            for (const [entry, value] of Object.entries(devDependencies)) {
                packagejson.devDependencies[entry] = value!
            }
        }
    }
    for (const [entry, value] of Object.entries(config ? state.options.devDependencies[config.type] ?? {} : {})) {
        packagejson.devDependencies[entry] = value!
    }
    for (const entry in dependencies ?? {}) {
        delete packagejson.devDependencies[entry]
    }
    if (JSON.stringify(packagejson.devDependencies) !== json) {
        console.warn(
            `[package.json>devDependencies] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson.devDependencies).text
            }`
        )

        fail(state)
    }
}

export function linDefinition(state: LintState): void {
    if (config?.template?.ignore?.packageDefinition) {
        return
    }

    const json = JSON.stringify(packagejson)
    for (const [entry, value] of Object.entries(config ? state.options.packageDefinition[config.type] ?? {} : {})) {
        packagejson[entry] = value
    }
    if (JSON.stringify(packagejson) !== json) {
        console.warn(
            `[package.json>${configurationKey}] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson).text
            }`
        )

        fail(state)
    }
}

export function fail(state: LintState): void {
    if (!state.options.fix) {
        state.shouldFail = true
    }
}

export function getRoot(options: LintOptions, type: string): readonly string[] {
    return options.roots[type] ?? [root]
}

export function getLinks(options: LintOptions): readonly string[] {
    return config?.type !== undefined ? options.links[config.type] ?? [] : []
}

export function lintDirectory(options: Partial<LintOptions> = {}): void {
    const state: LintState = {
        options: {
            packageDefinition,
            devDependencies: packageDevDependencies,
            dependencies: packageDependencies,
            scripts,
            links,
            roots,
            files,
            fix: false,
            ...options,
        },
        shouldFail: false,
    }

    lintPackage(state)
    lintTemplate(state)

    if (state.shouldFail) {
        throw new Error('Found errors in the project')
    }
}

export function builder(yargs: Argv) {
    return yargs.option('fix', {
        describe: 'try to fix the errors',
        type: 'boolean',
        default: false,
    })
}

export function handler(argv: ReturnType<typeof builder>['argv']): void {
    lintDirectory({ fix: argv.fix })
}

export default {
    command: 'lint',
    describe: 'lint the project configuration',
    builder,
    handler,
    lintDirectory,
    scripts,
    packageDependencies,
    packageDevDependencies,
    roots,
    links,
}
