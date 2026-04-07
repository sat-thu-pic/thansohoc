import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { lastName, name, birthDate, lifePath, missingNumbers } = await req.json();

    const prompt = `
      Bạn là một chuyên gia cố vấn đặt tên theo Thần số học Pytago (Naming Advisor). 
      Hãy viết một đoạn "Storytelling" (khoảng 150-200 chữ) giải thích ý nghĩa cái tên cho một em bé.

      Thông tin:
      - Họ của bé: ${lastName}
      - Tên được chọn: ${name}
      - Ngày sinh: ${birthDate}
      - Con số chủ đạo (Life Path): ${lifePath}
      - Các con số còn thiếu trong họ: ${missingNumbers.join(', ')}

      Yêu cầu:
      1. Ngôn ngữ: Tiếng Việt, chuyên nghiệp nhưng ấm áp, đầy cảm hứng (Growth/Enhancement).
      2. Giải thích cách cái tên "${name}" bù đắp các con số thiếu ${missingNumbers.join(', ')} để giúp bộ tên đầy đủ đạt cân bằng 1-9.
      3. Liên hệ với con số chủ đạo ${lifePath} để đưa ra lời khuyên về tiềm năng phát triển của bé.
      4. Tuyệt đối không dùng ngôn ngữ tiêu cực. Hãy tập trung vào việc "nâng cấp" và "kích hoạt" năng lượng.
      5. Kết thúc bằng một câu chúc ý nghĩa cho bé.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const storytelling = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể tạo nội dung tư vấn lúc này.';

    return NextResponse.json({ storytelling });
  } catch (error) {
    console.error('Storytelling API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
