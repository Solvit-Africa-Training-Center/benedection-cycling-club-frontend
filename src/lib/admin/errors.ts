import type { FieldErrors } from "./types";

/**
 * Error thrown by every function in `api.ts`.
 *
 * It lives in its own module (instead of inside `api.ts`) so that `auth.ts` and
 * `api.ts` can both use it without importing each other.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: FieldErrors;

  constructor(status: number, message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Turns anything thrown by the api layer into a message safe to show a user. */
export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Pulls field errors out of an unknown thrown value. */
export function errorFieldErrors(error: unknown): FieldErrors {
  return isApiError(error) ? (error.fieldErrors ?? {}) : {};
}
