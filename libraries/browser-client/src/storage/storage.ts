import { Storage as IStorage } from './types'

/**
 * @internal
 */
export class LocalStorage implements IStorage {
  private readonly storage: Storage

  constructor() {
    this.storage = window.localStorage
  }

  get(key: string): string | null {
    const val = this.storage.getItem(key)
    return val
  }

  set(key: string, val: string): void {
    this.storage.setItem(key, val)
  }

  getOrSet(key: string, genFn: () => string): string {
    let val = this.storage.getItem(key)
    if (val === null) {
      val = genFn()
      this.storage.setItem(key, val)
    }

    return val
  }
}
