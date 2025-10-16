import { useCallback, useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useEventCallback<TArgs extends Array<unknown>, TResult>(
  fn: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult
export function useEventCallback<TArgs extends Array<unknown>, TResult>(
  fn: ((...args: TArgs) => TResult) | undefined,
): ((...args: TArgs) => TResult) | undefined
export function useEventCallback<TArgs extends Array<unknown>, TResult>(
  fn: ((...args: TArgs) => TResult) | undefined,
): ((...args: TArgs) => TResult) | undefined {
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  useIsomorphicLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: TArgs) => ref.current?.(...args), [ref]) as (
    ...args: TArgs
  ) => TResult
}