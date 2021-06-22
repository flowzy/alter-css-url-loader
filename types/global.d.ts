declare namespace alterCssUrlLoader {
  export interface Options {
    reddit?: boolean
    alter?(url: string): string
  }
}
