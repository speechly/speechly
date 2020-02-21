declare module 'locale-codes' {
  export function getByTag(tag: string): object | undefined
}

interface Window {
  webkitAudioContext: typeof AudioContext
}
