import { run } from '~/index'

test('main', () => {
    expect(run).toBeTruthy()
})

test('maintwo', () => {
    expect({ foo: 'bar' }).toMatchInlineSnapshot(`
        Object {
          "foo": "bar",
        }
    `)
})
