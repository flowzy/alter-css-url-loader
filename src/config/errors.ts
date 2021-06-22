import { message } from './helpers'

const messages = {
  noOptions:
    'options are required. Please provide an "alter" function or set "reddit" option to `true`',
  alterWithReddit: 'cannot use property "reddit" together with "alter".',
}

type ErrorName = keyof typeof messages

export function getError(name: ErrorName, ...args: string[]): string {
  return message(messages[name], args)
}
