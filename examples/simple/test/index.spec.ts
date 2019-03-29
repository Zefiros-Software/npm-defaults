import { main } from '~/index'

describe('index', () => {
    test('main', () => {
        expect(main()).toEqual('yay')
    })
})
