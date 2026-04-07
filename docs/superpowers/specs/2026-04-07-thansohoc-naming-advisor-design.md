# Design Spec: Website Thần số học Pytago - Naming Advisor

**Ngày tạo:** 2026-04-07
**Trạng thái:** Chờ phê duyệt
**Chủ dự án:** NHHieu
**Mục tiêu:** Xây dựng Website hỗ trợ đặt tên cho con đóng vai trò như một "Advisor" (Người cố vấn), giúp cha mẹ tìm thấy cái tên cân bằng tuyệt đối (đầy đủ các số từ 1-9) dựa trên họ của bé, đồng thời cung cấp thông tin tham chiếu từ họ tên bố mẹ và ngày sinh.

## 1. Tổng quan hệ thống (Architecture)
- **Nền tảng:** Web Application (Next.js 14+ App Router).
- **Styling:** Tailwind CSS (Phong cách hiện đại, tối giản, tin cậy).
- **Backend:** Next.js Route Handlers (Serverless).
- **AI Integration:** Gemini API hoặc Vercel AI SDK để tạo nội dung "Storytelling" giải nghĩa tên và sự cân bằng năng lượng.
- **Database:** Local JSON file chứa danh sách tên Tiếng Việt chuẩn (Static Name DB), được tiền xử lý với Bitmask.

## 2. Dữ liệu đầu vào (Input Requirements)
Hệ thống thu thập các thông tin sau qua một Guided Flow:
1. **Họ tên Bố hoặc Mẹ:** Dùng để tham chiếu tính tương hợp (không tham gia thuật toán tính số thiếu chính).
2. **Họ của bé:** Dữ liệu cốt lõi để tính toán số thiếu.
3. **Giới tính của bé:** Để lọc danh sách tên phù hợp.
4. **Ngày sinh (dự kiến/chính xác):** Dùng để tính Con số Chủ đạo (Life Path) làm thông tin tư vấn bổ sung.

## 3. Logic & Thuật toán (Core Logic)
- **Mapping:** Chuyển đổi chữ cái sang số theo bảng Pytago chuẩn quốc tế (A-Z), bỏ qua dấu Tiếng Việt (ví dụ: 'â', 'ă' -> 'a' -> 1).
- **Tính toán Số thiếu (Missing Numbers):**
    1. Nhận Họ của bé (ví dụ: "NGUYEN").
    2. Chuyển đổi sang tập hợp số: N(5), G(7), U(3), Y(7), E(5), N(5) -> {3, 5, 7}.
    3. Xác định số thiếu trong tập {1-9}: {1, 2, 4, 6, 8, 9}.
- **Thuật toán tìm kiếm (Bitmasking):**
    - Mỗi tên/bộ tên trong DB được gán một 9-bit mask đại diện cho các con số nó chứa.
    - Lọc các tên có mask chứa **tất cả** các bit của "số thiếu" còn lại từ họ.
    - Ưu tiên các tên (hoặc bộ Tên đệm + Tên chính) tạo ra sự cân bằng tuyệt đối (đầy đủ 1-9).

## 4. Trải nghiệm người dùng (UX/UI)
- **Trang nhập liệu:** Form đơn giản, trực quan thu thập 4 thông tin đầu vào.
- **Trang kết quả:** 
    - Hiển thị **Biểu đồ năng lượng (Energy Grid)** của Họ, làm nổi bật các con số còn thiếu bằng màu sắc (ví dụ: đỏ/hồng cho số thiếu).
    - Hiển thị **Con số Chủ đạo** từ ngày sinh kèm giải nghĩa ngắn gọn.
    - Danh sách **Thẻ tên gợi ý (Name Cards)**: Mỗi thẻ cho biết các số mà tên đó bù đắp được.
    - **Storytelling AI:** Khi chọn một tên, AI sẽ tạo ra một đoạn phân tích sâu về lý do tên này được chọn, cách nó cân bằng năng lượng họ và mang lại tiềm năng phát triển cho bé.

## 5. Cấu trúc dữ liệu Tên (Name DB)
- **File:** `data/names.json`
- **Cấu trúc:**
```json
{
  "name": "Bình Minh",
  "gender": "boy",
  "numbers": [2, 9, 4, 8, 5],
  "mask": 402, 
  "meaning_summary": "Khởi đầu rực rỡ và vững chãi."
}
```

## 6. Kế hoạch triển khai (Implementation Phases)
- **Phase 1:** Setup Next.js, Tailwind và khung UI cơ bản cho Form nhập liệu.
- **Phase 2:** Triển khai Logic tính toán (Pytago Mapping & Bitmasking Filter).
- **Phase 3:** Xây dựng Name DB cơ bản và hiển thị Biểu đồ năng lượng.
- **Phase 4:** Tích hợp Gemini API cho Storytelling và hoàn thiện UI/UX.

---
**Cam kết chất lượng:** Hệ thống không chỉ là một công cụ lọc dữ liệu mà là một "Naming Consultant" giúp cha mẹ cảm thấy an tâm và tràn đầy cảm hứng khi chọn tên cho con.
