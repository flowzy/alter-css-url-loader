import { getOptions } from 'loader-utils'
import validateOptions from 'schema-utils'

import schema from './schema.json'

const LOADER_NAME = 'alter-css-url-loader'

function message(string) {
  return `[${LOADER_NAME}]: ${string}`
}

export default function loader(content) {
  const options = getOptions(this) || {}

  validateOptions(schema, options, { name: LOADER_NAME })

  if (typeof options.alter !== 'function' && typeof options.reddit !== 'boolean') {
    throw new TypeError(
      message(`property "alter" inside of "options" must be a function - ${typeof options.alter} given.`)
    )
  }

  const urls = content.match(/url\(.*?\)/gi)
  let alter = null

  // for when the usage of the plugin is for reddit,
  // provide a built-in "alter" function for
  // readying urls for Reddit
  if (typeof options.reddit === 'boolean') {
    if (typeof options.alter === 'function') {
      throw new Error(message(`cannot use property "reddit" together with "alter".`))
    }

    alter = function(path) {
      if (!options.reddit) {
        return path
      }

      const split = path.split('/')
      const last = split[split.length - 1]
      const name = last.slice(0, last.lastIndexOf('.'))

      return `%%${name}%%`
    }
  }

  urls.map((url) => {
    // remove url() from the match and leave only the path itself
    const stripped = url.replace(/^url\(/, '').replace(/\)$/, '')
    const func = alter !== null ? alter : options.alter

    content = content.replace(stripped, func(stripped))
  })

  return content
}
