import { ErrorCallback } from '../types'
import { Storage as IStorage, StorageGetCallback, ErrKeyNotFound } from './types'

export class LocalStorage implements IStorage {
  private readonly storage: Storage

  constructor() {
    this.storage = window.localStorage
  }

  initialize(cb: ErrorCallback): void {
    cb()
  }

  close(cb: ErrorCallback): void {
    cb()
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
