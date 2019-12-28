import compiler from './compiler.js'
import fs from 'fs'
import path from 'path'

const expected = (name) => {
  return JSON.stringify(
    fs.readFileSync(path.resolve(__dirname, `css/${name}.expected.css`), 'utf-8')
  )
}

const compile = async (options = {}) => {
  const stats = await compiler('sample.css', options)
  return stats.toJson().modules[0].source
}

describe('compilation', () => {
  it('replaces real path to a file with a Reddit-compatible string', async () => {
    const output = await compile({
      reddit: true,
    })

    expect(output).toMatch(expected('reddit'))
  })

  it('alters real path one directory backwards', async () => {
    const output = await compile({
      alter: (url) => url.replace('../', '../../'),
    })

    expect(output).toMatch(expected('alter'))
  })
})

describe('option usage', () => {
  it('throws an error when trying to use both "reddit" and "alter" options', async () => {
    try {
      await compile({
        reddit: true,
        alter: () => 'test',
      })

      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toMatch(/\[alter-css-url-loader\]/)
    }
  })

  it('allows to use "reddit" together with "alter", if "reddit" is set to "false"', async () => {
    try {
      const output = await compile({
        reddit: false,
        alter: (url) => url.replace('../', '../../'),
      })

      expect(output).toMatch(expected('alter'))
    } catch (error) {
      expect(false).toBe(true)
    }
  })
})
