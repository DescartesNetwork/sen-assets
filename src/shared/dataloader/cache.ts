export class SingleFlightCache {
  private static mapCache = new Map<string, any>()

  static set(key: string, value: any) {
    this.mapCache.set(key, value)
  }

  static get(key: string) {
    return this.mapCache.get(key)
  }
}
