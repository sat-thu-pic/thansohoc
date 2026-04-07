# Thần số học Pytago - Naming Advisor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng Website hỗ trợ đặt tên cho con đóng vai trò như một "Advisor", giúp tìm tên cân bằng tuyệt đối (1-9) dựa trên họ và ngày sinh của bé.

**Architecture:** Sử dụng Next.js 14+ App Router (Serverless) để đạt hiệu suất cao và SEO tốt. Logic tính toán và lọc tên được thực hiện ở phía Server/Edge để bảo mật, tích hợp Gemini API để tạo nội dung Storytelling cá nhân hóa.

**Tech Stack:** Next.js 14, Tailwind CSS, Lucide React (Icons), Gemini API (Google AI SDK), Bitmasking Algorithm.

---

## File Structure

- `src/lib/numerology.ts`: Chứa logic mapping Pytago, tính số thiếu, và tính con số chủ đạo.
- `src/lib/bitmask.ts`: Chứa logic xử lý bitmask để lọc tên nhanh chóng.
- `src/data/names.json`: Cơ sở dữ liệu tên (Static Name DB).
- `src/components/forms/AdvisorForm.tsx`: Form thu thập thông tin đầu vào (Bố mẹ, bé, ngày sinh).
- `src/components/visuals/EnergyGrid.tsx`: Biểu đồ năng lượng (1-9) hiển thị số thiếu.
- `src/components/cards/NameCard.tsx`: Thẻ hiển thị tên gợi ý và nút xem Storytelling.
- `src/app/api/storytelling/route.ts`: API Route gọi Gemini để tạo nội dung tư vấn.

---

### Task 1: Initialize Project & Setup Tailwind

- **Files:**
  - Create: `package.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Khởi tạo project Next.js 14**
- [ ] **Step 2: Cấu hình Tailwind CSS với bảng màu "Advisor" (Indigo/Blue)**
- [ ] **Step 3: Tạo trang chủ với tiêu đề và mô tả dự án**
- [ ] **Step 4: Kiểm tra build và commit**

### Task 2: Core Logic - Pytago Mapping & Life Path

- **Files:**
  - Create: `src/lib/numerology.ts`
  - Test: `src/lib/numerology.test.ts`

- [ ] **Step 1: Viết test cho hàm `mapNameToNumbers` (Ví dụ: "NGUYEN" -> [5,7,3,7,5,5])**
- [ ] **Step 2: Viết test cho hàm `calculateLifePath` (Ví dụ: "1990-01-01" -> 3)**
- [ ] **Step 3: Triển khai logic mapping chuẩn quốc tế A-Z**
- [ ] **Step 4: Triển khai logic tính Con số chủ đạo**
- [ ] **Step 5: Chạy test và commit**

### Task 3: Core Logic - Bitmasking & Missing Numbers

- **Files:**
  - Create: `src/lib/bitmask.ts`
  - Test: `src/lib/bitmask.test.ts`

- [ ] **Step 1: Viết test cho hàm `getMissingNumbers` từ tập hợp số của Họ**
- [ ] **Step 2: Viết test cho hàm `generateBitmask` (Chuyển danh sách số thành 9-bit integer)**
- [ ] **Step 3: Triển khai logic bitmasking**
- [ ] **Step 4: Chạy test và commit**

### Task 4: Name Database & Filtering Logic

- **Files:**
  - Create: `src/data/names.json`
  - Modify: `src/lib/bitmask.ts` (Thêm hàm lọc)

- [ ] **Step 1: Tạo tệp JSON với mẫu ~50 tên phổ biến, đã gán bitmask sẵn**
- [ ] **Step 2: Viết hàm `filterBalancedNames(lastNameMask, namesDB)` tìm tên bù đắp đủ bit còn thiếu**
- [ ] **Step 3: Viết test đảm bảo hàm lọc trả về đúng các tên tạo ra bộ số 1-9**
- [ ] **Step 4: Commit**

### Task 5: UI - Input Form (Guided Flow)

- **Files:**
  - Create: `src/components/forms/AdvisorForm.tsx`

- [ ] **Step 1: Xây dựng Form thu thập: Họ tên Bố/Mẹ, Giới tính, Ngày sinh, Họ bé**
- [ ] **Step 2: Thêm validation cơ bản cho các trường nhập liệu**
- [ ] **Step 3: Tích hợp State management để lưu thông tin sau khi nhấn "Bắt đầu tư vấn"**
- [ ] **Step 4: Commit**

### Task 6: UI - Energy Grid & Life Path Visualization

- **Files:**
  - Create: `src/components/visuals/EnergyGrid.tsx`

- [ ] **Step 1: Thiết kế Grid 3x3 hiển thị các số từ 1-9**
- [ ] **Step 2: Logic tô màu số thiếu (màu nhạt/đỏ) và số đã có (màu đậm/xanh)**
- [ ] **Step 3: Hiển thị Con số chủ đạo kèm icon và mô tả ngắn**
- [ ] **Step 4: Commit**

### Task 7: AI Integration - Gemini Storytelling

- **Files:**
  - Create: `src/app/api/storytelling/route.ts`
  - Create: `.env.local` (Thêm API Key)

- [ ] **Step 1: Cấu hình Gemini SDK**
- [ ] **Step 2: Viết Prompt thông minh cho Advisor (dùng các tiêu chí Storytelling trong Spec)**
- [ ] **Step 3: Triển khai API Route nhận (Họ, Tên chọn, Ngày sinh) và trả về nội dung tư vấn**
- [ ] **Step 4: Commit**

### Task 8: Final Assembly & Polishing

- **Files:**
  - Modify: `src/app/page.tsx`
  - Create: `src/components/cards/NameCard.tsx`

- [ ] **Step 1: Ráp nối Form -> Xử lý Logic -> Hiển thị Grid & Danh sách tên**
- [ ] **Step 2: Triển khai hiệu ứng loading khi AI đang viết Storytelling**
- [ ] **Step 3: Kiểm tra Responsive trên Mobile**
- [ ] **Step 4: Final build check & Commit**
