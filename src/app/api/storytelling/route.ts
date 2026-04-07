import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { lastName, name, birthDate, lifePath, missingNumbers } =
      await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local" },
        { status: 500 },
      );
    }

    // Initialize the SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Bạn là một chuyên gia cố vấn đặt tên cao cấp theo Thần số học Pytago (Naming Advisor). 
      Hãy viết một bài phân tích sâu sắc và đầy cảm hứng (khoảng 200 chữ) về ý nghĩa của cái tên đầy đủ của một em bé.

      Thông tin chi tiết:
      - Tên đầy đủ của bé: ${name}
      - Ngày sinh: ${birthDate}
      - Con số chủ đạo (Life Path): ${lifePath}
      - Các con số còn thiếu trong nền tảng họ của bé: ${missingNumbers.join(", ")}

      Yêu cầu bài viết:
      1. Ngôn ngữ: Tiếng Việt, phong cách chuyên nghiệp, ấm áp, mang tính chữa lành và nâng tầm (Growth & Enhancement).
      2. Giải thích tại sao cái tên "${name}" là sự lựa chọn hoàn hảo để bù đắp các rung động thiếu hụt (${missingNumbers.join(", ")}), giúp bé đạt được sự cân bằng năng lượng tuyệt đối từ 1-9.
      3. Kết nối tinh tế ý nghĩa cái tên với Con số chủ đạo ${lifePath} để phác họa lộ trình phát triển và tiềm năng vượt trội của bé trong tương lai.
      4. Tuyệt đối tránh các từ ngữ tiêu cực như "thiếu thốn", "yếu kém". Thay vào đó, hãy dùng "kích hoạt", "khơi mở", "bù đắp năng lượng".
      5. Cấu trúc bài viết mạch lạc, có mở đầu thu hút và kết thúc bằng một lời chúc phúc ý nghĩa cho hành trình của bé.
    `;

    // Generate content using the official SDK
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const storytelling =
      response.text() || "Cố vấn AI hiện đang bận, vui lòng thử lại sau.";

    return NextResponse.json({ storytelling });
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
