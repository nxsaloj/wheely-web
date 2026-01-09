export type Result<T, E extends Error = Error> = Success<T> | Failure<E>
export type Success<T> = { ok: true; value: T }
export type Failure<E extends Error = Error> = { ok: false; error: E }

export const ok = <T>(value: T): Success<T> => ({ ok: true, value })
export const err = <E extends Error>(error: E): Failure<E> => ({ ok: false, error })

export const isOk = <T, E extends Error>(result: Result<T, E>): result is Success<T> => result.ok
export const isErr = <T, E extends Error>(result: Result<T, E>): result is Failure<E> =>
  result.ok === false
