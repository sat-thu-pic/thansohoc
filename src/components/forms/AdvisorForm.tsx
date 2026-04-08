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
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-advisor-100 flex flex-col gap-6">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium flex items-center gap-2">
          <XCircle size={18} /> {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
            <User size={16} /> Họ của Bố
          </label>
          <input
            type="text"
            required
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            placeholder="Ví dụ: Nguyễn"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 text-slate-900 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
            <User size={16} /> Họ của Mẹ
          </label>
          <input
            type="text"
            required
            value={formData.motherLastName}
            onChange={(e) => setFormData({ ...formData, motherLastName: e.target.value })}
            placeholder="Ví dụ: Trần"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 text-slate-900 transition-all"
          />
        </div>
      </div>
      <p className="text-[10px] text-advisor-400 italic -mt-4">* Hệ thống sẽ gợi ý tên theo cả họ Bố và họ Mẹ.</p>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
          <Baby size={16} /> Giới tính của bé
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, babyGender: 'boy' })}
            className={`flex-1 py-3 rounded-lg border transition-all ${
              formData.babyGender === 'boy'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                : 'border-slate-200 text-slate-500 hover:border-blue-200'
            }`}
          >
            Bé Trai
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, babyGender: 'girl' })}
            className={`flex-1 py-3 rounded-lg border transition-all ${
              formData.babyGender === 'girl'
                ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold'
                : 'border-slate-200 text-slate-500 hover:border-pink-200'
            }`}
          >
            Bé Gái
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
          <Calendar size={16} /> Ngày sinh (Dự kiến hoặc chính xác)
        </label>
        <input
          type="date"
          required
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 text-slate-900 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-advisor-600 hover:bg-advisor-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-advisor-200 transform transition-all hover:-translate-y-1 active:scale-95"
      >
        BẮT ĐẦU TƯ VẤN
      </button>
    </form>
  );
}
