import { main } from '~/main'

import test from 'ava'

test('main', (t) => {
    t.deepEqual(main(), 'yay')
})
