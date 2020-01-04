declare namespace alterCssUrlLoader {
  export interface Errors {
    [key: string]: Function
    alterWithReddit?: Function
    alterMustBeFunction?: Function
  }

  export type Messages = {
    [key: string]: string
  }

  export interface Options {
    reddit?: boolean
    alter?(url: string): string
  }
}
