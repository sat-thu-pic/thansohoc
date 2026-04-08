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

export interface StorytellingInput {
  fullName: string;
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

  // Tạo đoạn văn về việc bù đắp số thiếu
  let balanceSection = "";
  if (missingNumbers.length > 0) {
    const filledDescriptions = filledNumbers.map((n) => {
      const meaning = NUMBER_MEANINGS[n];
      return `số ${n} (${meaning.title})`;
    });

    balanceSection = `Cái tên này mang đến năng lượng của ${filledDescriptions.join(", ")}, giúp cân bằng và khơi mở những tiềm năng mới cho bé.`;
  } else {
    balanceSection = `Cái tên này hoàn thiện năng lượng từ 1 đến 9, mang lại sự cân bằng toàn diện cho hành trình của bé.`;
  }

  // Kết hợp tất cả
  return `${nameMeaning} ${lifePathSection} ${balanceSection} Chúc bé luôn bình an, khỏe mạnh và hạnh phúc trên hành trình cuộc đời!`;
}

export function getMissingNumbersNarrative(missingNumbers: number[], presentNumbers: number[]): string {
  if (missingNumbers.length === 0) {
    return 'Ngày sinh của bé đã có đủ năng lượng từ 1 đến 9. Tên được chọn sẽ duy trì sự cân bằng hoàn hảo này.';
  }

  // Nhóm các số theo tính chất
  const getTraits = (numbers: number[]): string => {
    return numbers.map((n) => NUMBER_MEANINGS[n].title.toLowerCase()).join(', ');
  };

  const missingTraits = missingNumbers.map((n) => NUMBER_MEANINGS[n].title.toLowerCase());
  const presentTraits = presentNumbers.map((n) => NUMBER_MEANINGS[n].title.toLowerCase());

  // Tạo đoạn văn
  let narrative = '';
  
  if (presentNumbers.length > 0) {
    narrative += `Ngày sinh của bé đã có sẵn năng lượng ${getTraits(presentNumbers)}. `;
  }
  
  narrative += `Để đạt được sự cân bằng hoàn chỉnh từ 1 đến 9, bé cần được bổ sung thêm năng lượng ${missingTraits.join(', ')} thông qua cái tên.`;

  return narrative;
}
