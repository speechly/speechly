import React, { useEffect } from 'react'

export type KeyCallback = (event: KeyboardEvent) => any

export function useKeyboardEvent(
  keyDownCallback: KeyCallback,
  keyUpCallBack: KeyCallback,
  dependencies: React.DependencyList = [],
): void {
  useEffect(() => {
    window.addEventListener('keydown', keyDownCallback)
    window.addEventListener('keyup', keyUpCallBack)
    return () => {
      window.removeEventListener('keydown', keyDownCallback)
      window.removeEventListener('keyup', keyUpCallBack)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
