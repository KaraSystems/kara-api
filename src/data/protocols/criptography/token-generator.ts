export interface TokenGenerator {
  generator: (id: string) => Promise<string>

}
