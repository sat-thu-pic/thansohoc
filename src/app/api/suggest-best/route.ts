import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Candidate = {
  name: string;
  meaning: string;
  type: "father" | "mother" | "combined";
};

export async function POST(req: NextRequest) {
  try {
    const { birthDate, lifePath, missingNumbers, candidates } =
      (await req.json()) as {
        birthDate: string;
        lifePath: number;
        missingNumbers: number[];
        candidates: Candidate[];
      };

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ selectedName: null });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local" },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Bạn là cố vấn đặt tên cho em bé.
Hãy chọn đúng 1 tên đẹp nhất từ danh sách ứng viên bên dưới.

Thông tin em bé:
- Ngày sinh: ${birthDate}
- Life Path: ${lifePath}
- Các số thiếu từ ngày sinh: ${missingNumbers.join(", ") || "không có"}

Yêu cầu chấm chọn:
1. Ưu tiên tên nghe tự nhiên, hài hòa, dễ gọi trong tiếng Việt.
2. Ưu tiên tên có ý nghĩa tích cực, sáng rõ.
3. Không cần giải thích dài.
4. Chỉ được chọn đúng 1 tên có trong danh sách ứng viên.
5. Trả về JSON đúng định dạng: {"selectedName":"<tên được chọn>"}

Danh sách ứng viên:
${candidates
  .map(
    (candidate, index) =>
      `${index + 1}. ${candidate.name} | nhóm: ${candidate.type} | ý nghĩa: ${candidate.meaning}`,
  )
  .join("\n")}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text()?.trim() ?? "";

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ selectedName: null });
    }

    const parsed = JSON.parse(match[0]) as { selectedName?: string };
    const selectedName = parsed.selectedName?.trim();

    return NextResponse.json({ selectedName: selectedName || null });
  } catch (error: any) {
    console.error("Gemini best-name error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
