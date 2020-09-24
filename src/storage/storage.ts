import { Storage as IStorage, ErrKeyNotFound } from './types'

export class LocalStorage implements IStorage {
  private readonly storage: Storage

  constructor() {
    this.storage = window.localStorage
  }

  async initialize(): Promise<void> {}
  async close(): Promise<void> {}

  async get(key: string): Promise<string> {
    const val = this.storage.getItem(key)
    if (val === null) {
      throw ErrKeyNotFound
    }

    return val
  }

  async set(key: string, val: string): Promise<void> {
    this.storage.setItem(key, val)
  }

  async getOrSet(key: string, genFn: () => string): Promise<string> {
    let val = this.storage.getItem(key)
    if (val === null) {
      val = genFn()
      this.storage.setItem(key, val)
    }

    return val
  }
}
