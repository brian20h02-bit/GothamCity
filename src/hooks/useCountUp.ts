import { useEffect, useState } from 'react'

/**
 * Animates a numeric value from 0 to `target` over `duration` ms.
 * Only starts when `trigger` becomes true.
 */
export function useCountUp(target: number, duration = 1800, trigger = true): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger || target === 0) return

    let start: number | null = null
    let rafId: number

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, trigger])

  return count
}
