interface Window {
  webkitAudioContext: typeof AudioContext
}

declare module 'web-worker:*' {
  const WorkerFactory: new () => Worker
  export default WorkerFactory
}
