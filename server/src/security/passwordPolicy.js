/** Officer password floor (M6 / L3). */
export const MIN_PASSWORD_LENGTH = 10;

export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  return { ok: true };
}
