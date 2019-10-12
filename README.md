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
@zefiros/npm-defaults/0.2.0-beta.6 win32-x64 node-v12.6.0
$ npm-defaults --help [COMMAND]
USAGE
  $ npm-defaults COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`npm-defaults goodbye [FILE]`](#npm-defaults-goodbye-file)
* [`npm-defaults hello [FILE]`](#npm-defaults-hello-file)
* [`npm-defaults help [COMMAND]`](#npm-defaults-help-command)
* [`npm-defaults lint`](#npm-defaults-lint)
* [`npm-defaults make-release`](#npm-defaults-make-release)
* [`npm-defaults release`](#npm-defaults-release)

## `npm-defaults goodbye [FILE]`

describe the command here

```
USAGE
  $ npm-defaults goodbye [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

## `npm-defaults hello [FILE]`

describe the command here

```
USAGE
  $ npm-defaults hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ example-multi-ts hellowefwefwef
  hello world from ./src/hello.ts!
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src\commands\help.ts)_

## `npm-defaults lint`

describe the command here

```
USAGE
  $ npm-defaults lint

OPTIONS
  --fix
```

## `npm-defaults make-release`

describe the command here

```
USAGE
  $ npm-defaults make-release
```

## `npm-defaults release`

describe the command here

```
USAGE
  $ npm-defaults release
```
<!-- commandsstop -->
