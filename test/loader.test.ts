import fs from 'fs'
import path from 'path'

import compiler from './setup/compiler'
import { getError } from '../src/config/errors'
import type { Options } from '../types/loader'

const getExpectedResult = (name: string): string => {
  return JSON.stringify(
    fs.readFileSync(path.resolve(__dirname, `css/${name}.expected.css`), 'utf-8')
  )
}

const expectations = {
  disabled: getExpectedResult('disabled'),
  withoutUrl: getExpectedResult('without-url'),
  reddit: getExpectedResult('reddit'),
  alter: getExpectedResult('alter'),
}

const compile = async (
  fixture: 'sample-with-url' | 'sample-without-url',
  options?: Options
): Promise<string | Buffer> => {
  const stats = await compiler(`${fixture}.css`, options)

  return stats.toJson({ source: true }).modules[0].source
}

describe('compilation', () => {
  it('correctly uses the built-in Reddit function', async () => {
    await expect(
      compile('sample-with-url', {
        reddit: true,
      })
    ).resolves.toMatch(expectations.reddit)
  })

  it('alters url() parameters based on the provided function', async () => {
    await expect(
      compile('sample-with-url', {
        alter: (url) => url.replace('../', '../../'),
      })
    ).resolves.toMatch(expectations.alter)
  })
})

describe('option usage', () => {
  it('skips url processing when none are found', async () => {
    await expect(compile('sample-without-url', { reddit: true })).resolves.toMatch(
      expectations.withoutUrl
    )
  })

  it('skips url processing when disabled', async () => {
    await expect(compile('sample-with-url', { enabled: false })).resolves.toMatch(
      expectations.disabled
    )
  })

  it('fails when no options are provided', async () => {
    await expect(compile('sample-with-url')).rejects.toMatch(getError('noOptions'))
  })

  it('fails when both "alter" and "reddit" options are set', async () => {
    await expect(
      compile('sample-with-url', {
        reddit: true,
        alter: () => 'should not work',
      })
    ).rejects.toMatch(getError('alterWithReddit'))
  })

  it('fails if "alter" is provided and not a function', async () => {
    await expect(
      compile('sample-with-url', {
        alter: null,
      })
    ).rejects.toBeTruthy()
  })

  it('allows to use "reddit" together with "alter", if "reddit" is set to "false"', async () => {
    await expect(
      compile('sample-with-url', {
        reddit: false,
        alter: (url) => url.replace('../', '../../'),
      })
    ).resolves.toMatch(expectations.alter)
  })
})
