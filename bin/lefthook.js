const isCi = require('is-ci')
if (!isCi) {
    const execa = require('execa')
    execa.commandSync('lefthook install', {
        stdio: 'inherit',
    })
}
