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
@zefiros/npm-defaults/0.2.0-beta.11 linux-x64 node-v10.17.0
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

## `npm-defaults create TYPE NAME`

run all ci tests

```
USAGE
  $ npm-defaults create TYPE NAME

ARGUMENTS
  TYPE  (library|oclif-cli) [default: library] the package type
  NAME  the package name
```

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `npm-defaults lint`

lint the project configuration

```
USAGE
  $ npm-defaults lint

OPTIONS
  --fix
```

## `npm-defaults make-release`

create a pull request to release to stable

```
USAGE
  $ npm-defaults make-release
```

## `npm-defaults release`

release the package (standard-release)

```
USAGE
  $ npm-defaults release
```
<!-- commandsstop -->
