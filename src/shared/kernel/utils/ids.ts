const hasCryptoUUID =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function'

const createFallbackId = () => Math.random().toString(36).slice(2, 10)

export const createId = () => (hasCryptoUUID ? crypto.randomUUID() : createFallbackId())
