import { err, ok, type Result } from '@/shared/kernel/result'
import { ValidationError } from '@/shared/kernel/errors'

export function validateQuantity(value: number): Result<number, ValidationError> {
  if (!Number.isFinite(value)) {
    return err(new ValidationError('Quantity must be a valid number'))
  }

  if (value <= 0) {
    return err(new ValidationError('Quantity must be greater than zero'))
  }

  return ok(value)
}
