'use client';

import React, { useState } from 'react';
import { User, Baby, Calendar, Search, XCircle } from 'lucide-react';

interface AdvisorFormProps {
  onStart: (data: FormData) => void;
}

export interface FormData {
  parentName: string; // Họ Bố
  motherLastName: string; // Họ Mẹ
  babyGender: 'boy' | 'girl' | 'neutral';
  birthDate: string;
  lastName: string; // Vẫn giữ để tính toán (sẽ gán = Họ Bố)
}

export default function AdvisorForm({ onStart }: AdvisorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    motherLastName: '',
    babyGender: 'boy',
    birthDate: '',
    lastName: '',
  });

  const [error, setError] = useState<string | null>(null);

  const cleanNameStrict = (name: string) => {
    return name
      .normalize('NFD') // Tách dấu
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt tạm thời để lọc
      .replace(/[^a-zA-Z\s]/g, '') // CHỈ giữ lại chữ cái A-Z và khoảng trắng, xóa SỐ và KÝ TỰ ĐẶC BIỆT
      .trim();
  };

  // Hàm giữ lại dấu nhưng xóa số/icon để hiển thị
  const cleanDisplayFull = (name: string) => {
    // Regex này giữ lại các ký tự chữ cái bao gồm cả các chữ có dấu Tiếng Việt và xóa mọi thứ khác
    return name.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¿\d]/g, '').trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const selectedDate = new Date(formData.birthDate);
    if (isNaN(selectedDate.getTime())) {
      setError('Vui lòng chọn ngày sinh hợp lệ.');
      return;
    }

    // Regex kiểm tra: Chỉ cho phép chữ cái (bao gồm tiếng Việt có dấu) và khoảng trắng
    // Không cho phép số, ký tự đặc biệt, icon
    const validNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƯưăâêôơưẠ-ỹ\s]+$/;

    if (!validNameRegex.test(formData.parentName.trim())) {
      setError('Họ của Bố chứa ký tự không hợp lệ (số, icon hoặc ký tự đặc biệt).');
      return;
    }

    if (!validNameRegex.test(formData.motherLastName.trim())) {
      setError('Họ của Mẹ chứa ký tự không hợp lệ (số, icon hoặc ký tự đặc biệt).');
      return;
    }

    const fatherLast = formData.parentName.trim();
    const motherLast = formData.motherLastName.trim();

    if (fatherLast.length < 2 || motherLast.length < 2) {
      setError('Họ phải có ít nhất 2 ký tự.');
      return;
    }

    onStart({
      ...formData,
      parentName: fatherLast,
      motherLastName: motherLast
    });
  };

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl p-8 md:p-14 botanical-shadow relative z-10">
      {/* Asymmetric background accent inside card */}
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-surface-container-low rounded-bl-full -z-0"></div>

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative z-10 w-full max-w-full">
        {error && (
          <div className="p-4 bg-error-container border-l-4 border-error text-on-error-container rounded-r-lg text-sm font-label tracking-wide flex items-center gap-3">
            <span className="material-symbols-outlined">error</span> {error}
          </div>
        )}

        {/* Row 1: Surnames */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex flex-col gap-3 group">
            <label className="font-label text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase px-1">
              Họ của Bố
            </label>
            <div className="input-focus-glow transition-all duration-300 rounded-lg bg-surface-container-low">
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full bg-transparent border-none focus:ring-0 px-5 py-4 text-on-surface font-body placeholder:text-outline-variant placeholder:font-light outline-none"
                placeholder="Nhập họ bố..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 group">
            <label className="font-label text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase px-1">
              Họ của Mẹ
            </label>
            <div className="input-focus-glow transition-all duration-300 rounded-lg bg-surface-container-low">
              <input
                type="text"
                required
                value={formData.motherLastName}
                onChange={(e) => setFormData({ ...formData, motherLastName: e.target.value })}
                className="w-full bg-transparent border-none focus:ring-0 px-5 py-4 text-on-surface font-body placeholder:text-outline-variant placeholder:font-light outline-none"
                placeholder="Nhập họ mẹ..."
              />
            </div>
          </div>
        </div>

        {/* Row 2: Gender Segmented Control */}
        <div className="flex flex-col gap-4">
          <label className="font-label text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase px-1">
            Giới tính của bé
          </label>
          <div className="flex p-1.5 bg-surface-container-low rounded-full w-full">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, babyGender: 'boy' })}
              className={`flex-1 py-3 px-6 rounded-full text-sm font-medium font-body transition-all duration-300 ${formData.babyGender === 'boy'
                ? 'bg-white shadow-sm text-primary font-bold'
                : 'text-stone-500 hover:text-on-surface'
                }`}
            >
              Bé Trai
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, babyGender: 'girl' })}
              className={`flex-1 py-3 px-6 rounded-full text-sm font-medium font-body transition-all duration-300 ${formData.babyGender === 'girl'
                ? 'bg-white shadow-sm text-primary font-bold'
                : 'text-stone-500 hover:text-on-surface'
                }`}
            >
              Bé Gái
            </button>
          </div>
        </div>

        {/* Row 3: Date of Birth */}
        <div className="flex flex-col gap-3">
          <label className="font-label text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase px-1">
            Ngày sinh
          </label>
          <div className="input-focus-glow transition-all duration-300 rounded-lg bg-surface-container-low relative flex items-center">
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full bg-transparent border-none focus:ring-0 px-5 py-4 text-on-surface font-body outline-none appearance-none cursor-pointer"
            />
            {/* The calendar icon is hidden natively by some browsers or we can overlay a custom one */}
          </div>
          <p className="text-[11px] text-stone-400 font-body italic px-1">
            Tần số rung động được tính toán dựa trên ngày sinh dương lịch.
          </p>
        </div>

        {/* CTA Section */}
        <div className="pt-6">
          <button
            type="submit"
            className="sage-gradient-btn w-full py-5 rounded-full text-on-primary font-label font-bold tracking-[0.2em] text-sm uppercase transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
          >
            BẮT ĐẦU TƯ VẤN
          </button>
          <p className="text-center mt-6 text-xs text-on-surface-variant/60 font-body tracking-wide">
            Dựa trên nguyên lý Thần số học Pytago ✓

          </p>
        </div>
      </form>
    </div>
  );
}
