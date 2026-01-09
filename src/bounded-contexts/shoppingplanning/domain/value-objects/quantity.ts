import { ValidationError } from '@/shared/kernel/errors'
import { err, ok, type Result } from '@/shared/kernel/result'

const INVALID_NUMBER_MESSAGE = 'Quantity must be a valid number'
const NON_POSITIVE_MESSAGE = 'Quantity must be greater than zero'

export function validateQuantity(value: number): Result<number, ValidationError> {
  if (!Number.isFinite(value)) {
    return err(new ValidationError(INVALID_NUMBER_MESSAGE))
  }

  if (value <= 0) {
    return err(new ValidationError(NON_POSITIVE_MESSAGE))
  }

  return ok(value)
}
