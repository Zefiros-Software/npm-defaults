# Zefiros NPM Defaults
This package makes it easy to share development dependencies across Zefiros packages.

<!-- toc -->
* [Zefiros NPM Defaults](#zefiros-npm-defaults)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @zefiros/npm-defaults
$ npm-defaults COMMAND
running command...
$ npm-defaults (-v|--version|version)
@zefiros/npm-defaults/0.2.0-beta.48 linux-x64 node-v12.16.3
$ npm-defaults --help [COMMAND]
USAGE
  $ npm-defaults COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`npm-defaults ci`](#npm-defaults-ci)
* [`npm-defaults create TYPE NAME`](#npm-defaults-create-type-name)
* [`npm-defaults env`](#npm-defaults-env)
* [`npm-defaults help [COMMAND]`](#npm-defaults-help-command)
* [`npm-defaults lint`](#npm-defaults-lint)
* [`npm-defaults make-release`](#npm-defaults-make-release)
* [`npm-defaults release`](#npm-defaults-release)

## `npm-defaults ci`

run all ci tests

```
USAGE
  $ npm-defaults ci
```

_See code: [dist/commands/ci.ts](https://github.com/Zefiros-Software/npm-defaults/blob/v0.2.0-beta.48/dist/commands/ci.ts)_

## `npm-defaults create TYPE NAME`

run all ci tests

```
USAGE
  $ npm-defaults create TYPE NAME

ARGUMENTS
  TYPE  (library|oclif-cli) [default: library] the package type
  NAME  the package name
```

_See code: [dist/commands/create.ts](https://github.com/Zefiros-Software/npm-defaults/blob/v0.2.0-beta.48/dist/commands/create.ts)_

## `npm-defaults env`

provision global environment

```
USAGE
  $ npm-defaults env

OPTIONS
  -h, --help  show CLI help
  --install   install the environment
```

_See code: [dist/commands/env.ts](https://github.com/Zefiros-Software/npm-defaults/blob/v0.2.0-beta.48/dist/commands/env.ts)_

## `npm-defaults help [COMMAND]`

display help for npm-defaults

```
USAGE
  $ npm-defaults help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.0/src/commands/help.ts)_

## `npm-defaults lint`

lint the project configuration

```
USAGE
  $ npm-defaults lint

OPTIONS
  --fix
```

_See code: [dist/commands/lint.ts](https://github.com/Zefiros-Software/npm-defaults/blob/v0.2.0-beta.48/dist/commands/lint.ts)_

## `npm-defaults make-release`

create a pull request to release to stable

```
USAGE
  $ npm-defaults make-release
```

_See code: [dist/commands/make-release.ts](https://github.com/Zefiros-Software/npm-defaults/blob/v0.2.0-beta.48/dist/commands/make-release.ts)_

## `npm-defaults release`

release the package (standard-release)

```
USAGE
  $ npm-defaults release
```

_See code: [dist/commands/release.ts](https://github.com/Zefiros-Software/npm-defaults/blob/v0.2.0-beta.48/dist/commands/release.ts)_
<!-- commandsstop -->
