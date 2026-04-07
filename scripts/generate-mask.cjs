/**
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở terminal tại thư mục dự án.
 * 2. Chạy lệnh: node scripts/generate-mask.cjs "Tên Của Bạn"
 */

const PYTAGO_MAP = {
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

function generateBitmask(input) {
  if (!input) return 0;

  // 1. Làm sạch chuỗi (Bỏ dấu, chỉ giữ chữ cái A-Z)
  const cleanName = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  // 2. Lấy danh sách số tương ứng
  const numbers = cleanName.split('').map(char => PYTAGO_MAP[char]);

  // 3. Tính Bitmask
  let mask = 0;
  for (const num of numbers) {
    mask |= (1 << (num - 1));
  }

  return {
    name: input,
    cleanName: cleanName,
    numbers: Array.from(new Set(numbers)).sort(),
    mask: mask
  };
}

// Lấy tham số từ dòng lệnh
const args = process.argv.slice(2);
const nameToCalculate = args.join(' ');

if (!nameToCalculate) {
  console.log('\x1b[31m%s\x1b[0m', 'Lỗi: Vui lòng nhập tên cần tính mask!');
  console.log('Ví dụ: node scripts/generate-mask.cjs "Huy Hoàng"');
} else {
  const result = generateBitmask(nameToCalculate);
  console.log('\x1b[36m%s\x1b[0m', '----- KẾT QUẢ TÍNH MASK -----');
  console.log(`Tên gốc: ${result.name}`);
  console.log(`Số Pytago chứa: ${result.numbers.join(', ')}`);
  console.log('\x1b[32m%s\x1b[0m', `MASK VALUE: ${result.mask}`);
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log(`JSON gợi ý: { "name": "${result.name}", "mask": ${result.mask}, "meaning": "..." }`);
}
