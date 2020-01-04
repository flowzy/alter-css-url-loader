import { vsprintf } from 'sprintf-js'

import config from '../../package.json'

export const message = (msg: string, ...args: string[][]): string =>
  vsprintf(`[${config.name}]: ${msg}`, args)
