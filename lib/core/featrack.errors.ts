export class FeatrackError extends Error {
  constructor(message: string) {
    super(`${message}`)
    this.name = 'FeatrackError'
  }
}
