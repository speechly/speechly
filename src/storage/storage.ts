import { Storage as IStorage, ErrKeyNotFound } from './types'

export class LocalStorage implements IStorage {
  private readonly storage: Storage

  constructor() {
    this.storage = window.localStorage
  }

  async initialize(): Promise<void> {
    return Promise.resolve()
  }

  async close(): Promise<void> {
    return Promise.resolve()
  }

  async get(key: string): Promise<string> {
    const val = this.storage.getItem(key)
    if (val === null) {
      return Promise.reject(ErrKeyNotFound)
    }

    return Promise.resolve(val)
  }

  async set(key: string, val: string): Promise<void> {
    this.storage.setItem(key, val)
    return Promise.resolve()
  }

  async getOrSet(key: string, genFn: () => string): Promise<string> {
    let val = this.storage.getItem(key)
    if (val === null) {
      val = genFn()
      this.storage.setItem(key, val)
    }

    return Promise.resolve(val)
  }
}
