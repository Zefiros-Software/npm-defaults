import { main } from '~/main'

describe('index', () => {
    test('main', () => {
        expect(main()).toEqual('yay')
    })
})
