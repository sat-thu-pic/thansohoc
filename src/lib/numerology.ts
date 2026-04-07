const PYTAGO_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

/**
 * Maps a name to its corresponding Pytago numbers.
 * Standard A-Z mapping.
 */
export function mapNameToNumbers(name: string): number[] {
  // Loại bỏ dấu tiếng Việt trước khi mapping (nếu có)
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  return cleanName
    .split('')
    .filter((char) => /[A-Z]/.test(char))
    .map((char) => PYTAGO_MAP[char]);
}

/**
 * Calculates the Life Path number from a birth date.
 * Reduces the sum of all digits to a single digit (1-9).
 */
export function calculateLifePath(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, '').split('').map(Number);
  let sum = digits.reduce((acc, digit) => acc + digit, 0);

  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, digit) => acc + digit, 0);
  }

  return sum;
}

export function getDateDigits(date: string): number[] {
  // date format: YYYY-MM-DD
  return date
    .replace(/-/g, '')
    .split('')
    .map(Number)
    .filter((n) => n > 0); // Thần số học Pytago không tính số 0
}
