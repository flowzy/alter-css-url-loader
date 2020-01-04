import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

import compiler from './setup/compiler'
import { LoaderOptionsInterface } from '../src/typings'

const getExpectedResult = (name: string): string => {
  return JSON.stringify(
    fs.readFileSync(path.resolve(__dirname, `css/${name}.expected.css`), 'utf-8')
  )
}

const compile = async (options?: LoaderOptionsInterface): Promise<string> => {
  const stats = (await compiler('sample.css', options)) as webpack.Stats
  return stats.toJson().modules[0].source
}

describe('compilation', () => {
  it('correctly uses the built-in Reddit function', async () => {
    await expect(
      compile({
        reddit: true,
      })
    ).resolves.toMatch(getExpectedResult('reddit'))
  })

  it('alters url() parameters based on the provided function', async () => {
    await expect(
      compile({
        alter: (url) => url.replace('../', '../../'),
      })
    ).resolves.toMatch(getExpectedResult('alter'))
  })
})

describe('option usage', () => {
  it('fails when no options are provided', async () => {
    await expect(compile()).rejects.toThrow()
  })

  it('fails when both "alter" and "reddit" options are truthy', async () => {
    await expect(
      compile({
        reddit: true,
        alter: () => 'should not work',
      })
    ).rejects.toThrow()
  })

  it('allows to use "reddit" together with "alter", if "reddit" is set to "false"', async () => {
    await expect(
      compile({
        reddit: false,
        alter: (url: string) => url.replace('../', '../../'),
      })
    ).resolves.toMatch(getExpectedResult('alter'))
  })
})
