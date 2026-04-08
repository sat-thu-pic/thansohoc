// Ý nghĩa các số trong thần số học Pythagoras
export const NUMBER_MEANINGS: Record<
  number,
  { title: string; description: string }
> = {
  1: {
    title: "Lãnh đạo",
    description: "Độc lập, tiên phong, ý chí mạnh mẽ, khả năng dẫn dắt",
  },
  2: {
    title: "Hòa hợp",
    description: "Trực giác, hợp tác, ngoại giao, sự cân bằng",
  },
  3: {
    title: "Sáng tạo",
    description: "Trí tưởng tượng, giao tiếp, nghệ thuật, lạc quan",
  },
  4: {
    title: "Nền tảng",
    description: "Kỷ luật, thực tế, ổn định, làm việc chăm chỉ",
  },
  5: {
    title: "Tự do",
    description: "Phiêu lưu, linh hoạt, thay đổi, thích nghi",
  },
  6: {
    title: "Yêu thương",
    description: "Trách nhiệm, gia đình, chữa lành, lòng trắc ẩn",
  },
  7: {
    title: "Tri thức",
    description: "Phân tích, trực giác sâu, tìm kiếm chân lý, tâm linh",
  },
  8: {
    title: "Thành công",
    description: "Quyền lực, tài chính, điều hành, hiện thực hóa",
  },
  9: {
    title: "Nhân đạo",
    description: "Bác ái, bao dung, lý tưởng lớn, cống hiến",
  },
};

// Ý nghĩa Life Path
export const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: "người tiên phong, có khả năng dẫn dắt và khai phá con đường riêng",
  2: "người hòa giải, có trực giác nhạy bén và khả năng kết nối mọi người",
  3: "người sáng tạo, có tài năng nghệ thuật và khả năng truyền cảm hứng",
  4: "người xây dựng, có kỷ luật và khả năng tạo dựng nền tảng vững chắc",
  5: "người tự do, có tinh thần phiêu lưu và khả năng thích nghi tuyệt vời",
  6: "người chăm sóc, có lòng yêu thương và trách nhiệm với gia đình, cộng đồng",
  7: "người tìm kiếm, có tư duy sâu sắc và trực giác tâm linh mạnh mẽ",
  8: "người điều hành, có tầm nhìn tài chính và khả năng hiện thực hóa mục tiêu",
  9: "người nhân đạo, có trái tim bao dung và lý tưởng cống hiến cho xã hội",
};

// Pythagoras letter-to-number mapping
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

// Lấy danh sách số từ một tên (với chữ cái tương ứng)
export function getNameNumbersDetail(name: string): { letter: string; number: number }[] {
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .toUpperCase();

  const result: { letter: string; number: number }[] = [];
  
  for (const char of cleanName) {
    if (/[A-Z]/.test(char) && PYTAGO_MAP[char]) {
      result.push({ letter: char, number: PYTAGO_MAP[char] });
    }
  }

  return result;
}

// Format chi tiết: chữ cái -> số -> ý nghĩa
export function formatNameLettersDetail(name: string): string {
  const details = getNameNumbersDetail(name);
  
  // Group letters by number
  const numberGroups: Record<number, string[]> = {};
  for (const item of details) {
    if (!numberGroups[item.number]) {
      numberGroups[item.number] = [];
    }
    numberGroups[item.number].push(item.letter);
  }

  const parts: string[] = [];
  for (let i = 1; i <= 9; i++) {
    if (numberGroups[i] && numberGroups[i].length > 0) {
      const letters = numberGroups[i].join(' + ');
      const meaning = NUMBER_MEANINGS[i];
      parts.push(`chữ ${letters} = số ${i} (${meaning.title})`);
    }
  }

  return parts.join(', ');
}

export interface NameAnalysis {
  intro: string;
  lifePathSection: string;
  nameBreakdown: {
    part: string; // "Họ", "Tên đệm", "Tên chính"
    name: string; // "Nguyễn", "Đình", "Khôi"
    letters: { letter: string; number: number; meaning: string }[];
  }[];
  balanceSection: string;
  conclusion: string;
}

export function generateNameAnalysis(
  surname: string,
  middleName: string,
  firstName: string,
  middleNameMeaning: string,
  firstNameMeaning: string,
  lifePath: number,
  missingNumbers: number[],
  filledNumbers: number[]
): NameAnalysis {
  const lifePathDesc = LIFE_PATH_MEANINGS[lifePath] || "có tiềm năng đặc biệt";

  // Intro
  const intro = `"${middleName}" mang ý nghĩa ${middleNameMeaning.toLowerCase()}, kết hợp với "${firstName}" (${firstNameMeaning.toLowerCase()}) tạo nên một cái tên giàu ý nghĩa.`;

  // Life Path
  const lifePathSection = `Con số chủ đạo ${lifePath}: bé có tiềm năng trở thành ${lifePathDesc}.`;

  // Name breakdown
  const getLettersDetail = (name: string): { letter: string; number: number; meaning: string }[] => {
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/Đ/g, 'D')
      .replace(/đ/g, 'd')
      .toUpperCase();

    const result: { letter: string; number: number; meaning: string }[] = [];
    for (const char of cleanName) {
      if (/[A-Z]/.test(char) && PYTAGO_MAP[char]) {
        const num = PYTAGO_MAP[char];
        result.push({
          letter: char,
          number: num,
          meaning: NUMBER_MEANINGS[num].title,
        });
      }
    }
    return result;
  };

  const nameBreakdown: NameAnalysis['nameBreakdown'] = [];

  if (surname) {
    nameBreakdown.push({
      part: 'Họ',
      name: surname,
      letters: getLettersDetail(surname),
    });
  }

  if (middleName) {
    nameBreakdown.push({
      part: 'Tên đệm',
      name: middleName,
      letters: getLettersDetail(middleName),
    });
  }

  if (firstName) {
    nameBreakdown.push({
      part: 'Tên chính',
      name: firstName,
      letters: getLettersDetail(firstName),
    });
  }

  // Balance section
  let balanceSection = "";
  if (missingNumbers.length > 0 && filledNumbers.length > 0) {
    const filledDescriptions = filledNumbers.map((n) => `số ${n} (${NUMBER_MEANINGS[n].title})`);
    balanceSection = `Bổ sung ${filledDescriptions.join(', ')} → đạt cân bằng 1-9.`;
  } else if (missingNumbers.length === 0) {
    balanceSection = `Đã đạt cân bằng hoàn chỉnh từ 1 đến 9.`;
  }

  const conclusion = "Chúc bé luôn bình an, khỏe mạnh và hạnh phúc!";

  return {
    intro,
    lifePathSection,
    nameBreakdown,
    balanceSection,
    conclusion,
  };
}

export interface StorytellingInput {
  fullName: string;
  surname: string;
  firstName: string;
  middleName: string;
  firstNameMeaning: string;
  middleNameMeaning: string;
  lifePath: number;
  missingNumbers: number[];
  filledNumbers: number[];
}

export function generateStorytelling(input: StorytellingInput): string {
  const {
    fullName,
    surname,
    firstName,
    middleName,
    firstNameMeaning,
    middleNameMeaning,
    lifePath,
    missingNumbers,
    filledNumbers,
  } = input;

  const lifePathDesc = LIFE_PATH_MEANINGS[lifePath] || "có tiềm năng đặc biệt";

  // Tạo đoạn văn về ý nghĩa tên
  const nameMeaning = `"${middleName}" mang ý nghĩa ${middleNameMeaning.toLowerCase()}, kết hợp với "${firstName}" (${firstNameMeaning.toLowerCase()}) tạo nên một cái tên giàu ý nghĩa.`;

  // Tạo đoạn văn về Life Path
  const lifePathSection = `Với Con số chủ đạo ${lifePath}, bé có tiềm năng trở thành ${lifePathDesc}.`;

  // Tạo phần phân tích chi tiết từng chữ cái
  let letterBreakdown = '';

  // Phân tích họ
  const surnameDetail = formatNameLettersDetail(surname);
  if (surnameDetail) {
    letterBreakdown += `\n\nHọ "${surname}": ${surnameDetail}.`;
  }

  // Phân tích tên đệm
  const middleDetail = formatNameLettersDetail(middleName);
  if (middleDetail) {
    letterBreakdown += `\n\nTên đệm "${middleName}": ${middleDetail}.`;
  }

  // Phân tích tên chính
  const firstDetail = formatNameLettersDetail(firstName);
  if (firstDetail) {
    letterBreakdown += `\n\nTên chính "${firstName}": ${firstDetail}.`;
  }

  // Tạo đoạn văn về việc bù đắp số thiếu
  let balanceSection = "";
  if (missingNumbers.length > 0 && filledNumbers.length > 0) {
    const filledDescriptions = filledNumbers.map((n) => {
      const meaning = NUMBER_MEANINGS[n];
      return `số ${n} (${meaning.title})`;
    });
    balanceSection = `\n\nKết hợp với ngày sinh, họ và tên giúp bổ sung ${filledDescriptions.join(', ')} cho bé, đạt được sự cân bằng hoàn chỉnh từ 1 đến 9.`;
  } else if (missingNumbers.length === 0) {
    balanceSection = `\n\nKết hợp với ngày sinh, họ và tên tạo nên sự cân bằng hoàn chỉnh từ 1 đến 9.`;
  }

  // Kết hợp tất cả
  return `${nameMeaning} ${lifePathSection}${letterBreakdown}${balanceSection}\n\nChúc bé luôn bình an, khỏe mạnh và hạnh phúc!`;
}

export function getMissingNumbersNarrative(missingNumbers: number[], presentNumbers: number[]): string {
  if (missingNumbers.length === 0) {
    return 'Ngày sinh của bé đã có đủ năng lượng từ 1 đến 9. Tên được chọn sẽ duy trì sự cân bằng hoàn hảo này.';
  }

  // Format số + tên năng lượng
  const formatNumbers = (numbers: number[]): string => {
    return numbers
      .sort((a, b) => a - b)
      .map((n) => `${NUMBER_MEANINGS[n].title.toLowerCase()} (số ${n})`)
      .join(', ');
  };

  // Tạo đoạn văn
  let narrative = '';
  
  if (presentNumbers.length > 0) {
    narrative += `Ngày sinh của bé đã có sẵn năng lượng ${formatNumbers(presentNumbers)}. `;
  }
  
  narrative += `Để đạt được sự cân bằng hoàn chỉnh từ 1 đến 9, bé cần được bổ sung thêm năng lượng ${formatNumbers(missingNumbers)} thông qua cái tên.`;

  return narrative;
}
