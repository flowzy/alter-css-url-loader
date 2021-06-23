export interface Options {
  reddit?: boolean
  alter?(url: string): string
  enabled?: boolean
}
