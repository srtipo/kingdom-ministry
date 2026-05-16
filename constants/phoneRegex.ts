export const PHONE_REGEX = /^(?:$|0\d{10}|\+\d{10,15})$/;

export function isValidPhone(phone?: string | null): boolean {
  if (phone === null || phone === undefined) return true;
  return PHONE_REGEX.test(phone);
}

export default isValidPhone;
