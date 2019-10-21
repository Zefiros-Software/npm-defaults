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
@zefiros/npm-defaults/0.2.0-beta.10 linux-x64 node-v10.16.3
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
* [`npm-defaults plugins`](#npm-defaults-plugins)
* [`npm-defaults plugins:install PLUGIN...`](#npm-defaults-pluginsinstall-plugin)
* [`npm-defaults plugins:link PLUGIN`](#npm-defaults-pluginslink-plugin)
* [`npm-defaults plugins:uninstall PLUGIN...`](#npm-defaults-pluginsuninstall-plugin)
* [`npm-defaults plugins:update`](#npm-defaults-pluginsupdate)
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

## `npm-defaults plugins`

list installed plugins

```
USAGE
  $ npm-defaults plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ npm-defaults plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/index.ts)_

## `npm-defaults plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ npm-defaults plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ npm-defaults plugins:add

EXAMPLES
  $ npm-defaults plugins:install myplugin 
  $ npm-defaults plugins:install https://github.com/someuser/someplugin
  $ npm-defaults plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/install.ts)_

## `npm-defaults plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ npm-defaults plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ npm-defaults plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/link.ts)_

## `npm-defaults plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ npm-defaults plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ npm-defaults plugins:unlink
  $ npm-defaults plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/uninstall.ts)_

## `npm-defaults plugins:update`

update installed plugins

```
USAGE
  $ npm-defaults plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/update.ts)_

## `npm-defaults release`

release the package (standard-release)

```
USAGE
  $ npm-defaults release
```
<!-- commandsstop -->
