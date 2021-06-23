import { getOptions } from 'loader-utils'
import { validate } from 'schema-utils'
import type { JSONSchema4 } from 'schema-utils/declarations/validate'

import config from '../package.json'
import { getError } from './config/errors'
import schema from './schema.json'

export default function loader(content: string): string {
  const options = getOptions(this) as alterCssUrlLoader.Options

  validate(schema as JSONSchema4, options, { name: config.name })

  if (typeof options.alter === 'undefined' && typeof options.reddit === 'undefined') {
    throw new Error(getError('noOptions'))
  }

  // for when the usage of the plugin is for reddit,
  // provide a built-in "alter" function for
  // readying urls for Reddit
  if (options.reddit === true) {
    if (typeof options.alter === 'function') {
      throw new Error(getError('alterWithReddit'))
    }

    options.alter = (url) => {
      const filename = url.substr(url.lastIndexOf('/') + 1)
      const name = filename.substr(0, filename.lastIndexOf('.'))

      return `%%${name}%%`
    }
  }

  // collect all url()s
  const urls = content.match(/url\(.*?\)/gi)

  if (!urls) {
    return content
  }

  urls.map((url) => {
    // remove url() from the match and leave only the path itself
    const stripped = url.replace(/^url\(/, '').replace(/\)$/, '')

    content = content.replace(stripped, options.alter(stripped))
  })

  return content
}
