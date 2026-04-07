import { mapNameToNumbers, calculateLifePath } from './numerology';

describe('mapNameToNumbers', () => {
  test('should map NGUYEN to [5, 7, 3, 7, 5, 5]', () => {
    expect(mapNameToNumbers('NGUYEN')).toEqual([5, 7, 3, 7, 5, 5]);
  });

  test('should map ABC to [1, 2, 3]', () => {
    expect(mapNameToNumbers('ABC')).toEqual([1, 2, 3]);
  });

  test('should handle lowercase names', () => {
    expect(mapNameToNumbers('nguyen')).toEqual([5, 7, 3, 7, 5, 5]);
  });

  test('should ignore non-alphabetic characters', () => {
    expect(mapNameToNumbers('NGUYEN 123')).toEqual([5, 7, 3, 7, 5, 5]);
  });
});

describe('calculateLifePath', () => {
  test('should calculate Life Path for 1990-01-01 to be 3', () => {
    expect(calculateLifePath('1990-01-01')).toBe(3);
  });

  test('should calculate Life Path for 1992-05-15', () => {
    // 1+9+9+2+0+5+1+5 = 32 -> 3+2 = 5
    expect(calculateLifePath('1992-05-15')).toBe(5);
  });

  test('should handle different date formats (non-digits)', () => {
    expect(calculateLifePath('1990/01/01')).toBe(3);
  });

  test('should reduce to a single digit repeatedly', () => {
    // 1999-09-29 -> 1+9+9+9+0+9+2+9 = 48 -> 4+8 = 12 -> 1+2 = 3
    expect(calculateLifePath('1999-09-29')).toBe(3);
  });
});
