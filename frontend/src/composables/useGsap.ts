import gsap from 'gsap'

export function useSafeGsap() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return {
    animate(targets, vars) {
      if (reduced) return gsap.set(targets, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 })
      return gsap.to(targets, vars)
    },
    from(targets, vars) {
      if (reduced) return gsap.set(targets, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 })
      return gsap.from(targets, vars)
    },
    fromTo(targets, fromVars, toVars) {
      if (reduced) return gsap.set(targets, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 })
      return gsap.fromTo(targets, fromVars, toVars)
    },
    timeline(vars) {
      return reduced ? null : gsap.timeline(vars)
    }
  }
}
