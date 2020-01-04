import { message } from './helpers'

const errors: alterCssUrlLoader.Errors = {}
const messages: alterCssUrlLoader.Messages = {
  alterWithReddit: 'cannot use property "reddit" together with "alter".',
  alterMustBeFunction: 'property "alter" inside of "options" must be a function - %s given.',
}

Object.entries(messages).map(
  ([key, value]) => (errors[key] = (...args: string[]): string => message(value, args))
)

export default errors
