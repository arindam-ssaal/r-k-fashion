export type UsePromise<Value> = Promise<Value> & {
  status: 'pending' | 'fulfilled' | 'rejected'
  value: Value
  reason: unknown
}

export function use<Value>(promise: Promise<Value>): Value {
  const usePromise = promise as UsePromise<Value>
  if (usePromise.status === 'fulfilled') return usePromise.value
  if (usePromise.status === 'rejected') throw usePromise.reason
  if (usePromise.status === 'pending') throw usePromise
  usePromise.status = 'pending'

  promise
    .then((result) => {
      usePromise.status = 'fulfilled'
      usePromise.value = result
    })
    .catch((reason) => {
      usePromise.status = 'rejected'
      usePromise.reason = reason
    })
  throw usePromise
}
