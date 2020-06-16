import { run } from '~/index'

import test from 'ava'

test('main', t => {
    t.truthy(run)
})
