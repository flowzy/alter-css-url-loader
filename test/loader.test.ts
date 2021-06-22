import fs from 'fs'
import path from 'path'

import compiler from './setup/compiler'
import { getError } from '../src/config/errors'

const getExpectedResult = (name: string): string => {
  return JSON.stringify(
    fs.readFileSync(path.resolve(__dirname, `css/${name}.expected.css`), 'utf-8')
  )
}

const expectations = {
  reddit: getExpectedResult('reddit'),
  alter: getExpectedResult('alter'),
}

const compile = async (options?: alterCssUrlLoader.Options): Promise<string | Buffer> => {
  const stats = await compiler('sample.css', options)

  return stats.toJson({ source: true }).modules[0].source
}

describe('compilation', () => {
  it('correctly uses the built-in Reddit function', async () => {
    await expect(
      compile({
        reddit: true,
      })
    ).resolves.toMatch(expectations.reddit)
  })

  it('alters url() parameters based on the provided function', async () => {
    await expect(
      compile({
        alter: (url) => url.replace('../', '../../'),
      })
    ).resolves.toMatch(expectations.alter)
  })
})

describe('option usage', () => {
  it('fails when no options are provided', async () => {
    await expect(compile()).rejects.toMatch(getError('noOptions'))
  })

  it('fails when both "alter" and "reddit" options are set', async () => {
    await expect(
      compile({
        reddit: true,
        alter: () => 'should not work',
      })
    ).rejects.toMatch(getError('alterWithReddit'))
  })

  it('fails if "alter" is provided and not a function', async () => {
    await expect(
      compile({
        alter: null,
      })
    ).rejects.toBeTruthy()
  })

  it('allows to use "reddit" together with "alter", if "reddit" is set to "false"', async () => {
    await expect(
      compile({
        reddit: false,
        alter: (url) => url.replace('../', '../../'),
      })
    ).resolves.toMatch(expectations.alter)
  })
})
