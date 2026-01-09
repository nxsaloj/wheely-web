const toNumber = (value: number) => Number(value)

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, toNumber(ms)))
