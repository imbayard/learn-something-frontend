export function debounce<T, F extends (...args: any[]) => any>(
  func: F,
  wait: number
): F {
  let timeout: NodeJS.Timeout | null

  return function (this: T, ...args: Parameters<F>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait) as any
  } as F
}
