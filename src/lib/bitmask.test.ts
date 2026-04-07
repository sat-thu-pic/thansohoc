import { generateBitmask, getMissingNumbers, isPerfectlyBalanced } from './bitmask';

describe('Bitmasking Logic', () => {
  test('generateBitmask should convert [1, 2, 3] to 7', () => {
    // 2^0 + 2^1 + 2^2 = 1 + 2 + 4 = 7
    expect(generateBitmask([1, 2, 3])).toBe(7);
  });

  test('generateBitmask should handle [1, 9] correctly', () => {
    // 2^0 + 2^8 = 1 + 256 = 257
    expect(generateBitmask([1, 9])).toBe(257);
  });

  test('getMissingNumbers should return [1-9] for mask 0', () => {
    expect(getMissingNumbers(0)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('getMissingNumbers should return missing bits', () => {
    // Mask 7 (bits 0, 1, 2 are set) -> missing 3, 4, 5, 6, 7, 8, 9 (indices 3-8)
    expect(getMissingNumbers(7)).toEqual([4, 5, 6, 7, 8, 9]);
  });

  test('isPerfectlyBalanced should return true if all bits are set', () => {
    const lastNameMask = generateBitmask([1, 2, 3, 4, 5]);
    const nameMask = generateBitmask([6, 7, 8, 9]);
    expect(isPerfectlyBalanced(lastNameMask, nameMask)).toBe(true);
  });

  test('isPerfectlyBalanced should return false if any bit is missing', () => {
    const lastNameMask = generateBitmask([1, 2, 3]);
    const nameMask = generateBitmask([4, 5, 6, 7, 8]);
    expect(isPerfectlyBalanced(lastNameMask, nameMask)).toBe(false); // Thiếu số 9
  });
});
