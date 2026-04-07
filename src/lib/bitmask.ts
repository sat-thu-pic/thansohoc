/**
 * Chuyển đổi danh sách các số (1-9) thành một số nguyên 9-bit (Bitmask).
 * Số 1 tương ứng bit 0 (vị trí 0), số 9 tương ứng bit 8 (vị trí 8).
 */
export function generateBitmask(numbers: number[]): number {
  let mask = 0;
  for (const num of numbers) {
    if (num >= 1 && num <= 9) {
      mask |= (1 << (num - 1));
    }
  }
  return mask;
}

/**
 * Lấy danh sách các số còn thiếu (1-9) dựa trên bitmask hiện tại.
 */
export function getMissingNumbers(mask: number): number[] {
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!(mask & (1 << (i - 1)))) {
      missing.push(i);
    }
  }
  return missing;
}

/**
 * Kiểm tra xem một cái tên (nameMask) có bù đắp hoàn toàn các số thiếu của Họ (lastNameMask) không.
 * Một bộ tên đầy đủ cân bằng khi mask tổng là 511 (tất cả 9 bit đều là 1).
 */
export function isPerfectlyBalanced(lastNameMask: number, nameMask: number): boolean {
  return (lastNameMask | nameMask) === 511;
}

export interface NameRecord {
  name: string;
  gender: string;
  mask: number;
  meaning: string;
}

/**
 * Lọc danh sách tên giúp bù đắp CÀNG NHIỀU CÀNG TỐT hoặc HOÀN TOÀN các số thiếu.
 * Ở phiên bản này, chúng ta ưu tiên tìm các tên bù đắp HOÀN TOÀN (Cân bằng tuyệt đối).
 */
export function filterBalancedNames(lastNameMask: number, names: NameRecord[]): NameRecord[] {
  return names.filter((name) => isPerfectlyBalanced(lastNameMask, name.mask));
}
