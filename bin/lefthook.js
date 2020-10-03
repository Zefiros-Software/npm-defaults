const isCi = require('is-ci')
if (!isCi) {
    const execa = require('execa')

    let dependencies = {}
    try {
        const { stdout } = execa.commandSync('npm list -j -g @arkweid/lefthook')
        dependencies = JSON.parse(stdout).dependencies
    } catch (err) {
        dependencies = {}
    }
    if (dependencies['@arkweid/lefthook'] === undefined) {
        execa.commandSync('npm i -g @arkweid/lefthook', { stdio: 'inherit' })
    }

    execa.commandSync('lefthook install', { stdio: 'inherit' })
}
