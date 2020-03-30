import { Storage as IStorage, StorageGetCallback, ErrorCallback } from '../types'
import { ErrNoStorageSupport, ErrKeyNotFound } from './const'

export class LocalStorage implements IStorage {
  private readonly storage: Storage

  constructor() {
    if (window.localStorage === undefined) {
      throw ErrNoStorageSupport
    }

    this.storage = window.localStorage
  }

  get(key: string, cb: StorageGetCallback): void {
    const val = this.storage.getItem(key)
    if (val === null) {
      return cb(ErrKeyNotFound)
    }

    return cb(undefined, val)
  }

  set(key: string, val: string, cb: ErrorCallback): void {
    this.storage.setItem(key, val)
    return cb()
  }
}
