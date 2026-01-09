const NOT_FOUND_CODE = 'NOT_FOUND'
const VALIDATION_CODE = 'VALIDATION_ERROR'
const CONFLICT_CODE = 'CONFLICT'

export class DomainError extends Error {
  public code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'DomainError'
    this.code = code
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, NOT_FOUND_CODE)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, VALIDATION_CODE)
    this.name = 'ValidationError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, CONFLICT_CODE)
    this.name = 'ConflictError'
  }
}
