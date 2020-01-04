import { getOptions } from 'loader-utils'
import validateOptions from 'schema-utils'
import { JSONSchema4 } from 'schema-utils/declarations/validate'

import config from '../package.json'
import errors from './config/errors'
import schema from './schema.json'

export default function loader(content: string): string {
  const options = getOptions(this) as alterCssUrlLoader.Options

  validateOptions(schema as JSONSchema4, options, { name: config.name })

  let usingBuiltInAlter = false

  if (typeof options.alter !== 'function' && options.reddit !== true && !usingBuiltInAlter) {
    throw new TypeError(errors.alterMustBeFunction(typeof options.alter))
  }

  // collect all url()s
  const urls = content.match(/url\(.*?\)/gi)

  // for when the usage of the plugin is for reddit,
  // provide a built-in "alter" function for
  // readying urls for Reddit
  if (options.reddit === true) {
    if (typeof options.alter === 'function') throw new TypeError(errors.alterWithReddit())

    options.alter = (url) => {
      const filename = url.substr(url.lastIndexOf('/') + 1)
      const name = filename.substr(0, filename.lastIndexOf('.'))

      return `%%${name}%%`
    }

    // avoid a conflict in rebuilds
    usingBuiltInAlter = true
  }

  urls.map((url) => {
    // remove url() from the match and leave only the path itself
    const stripped = url.replace(/^url\(/, '').replace(/\)$/, '')

    content = content.replace(stripped, options.alter(stripped))
  })

  return content
}
