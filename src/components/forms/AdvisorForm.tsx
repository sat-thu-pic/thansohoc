'use client';

import React, { useState } from 'react';
import { User, Baby, Calendar, Search, XCircle } from 'lucide-react';

interface AdvisorFormProps {
  onStart: (data: FormData) => void;
}

export interface FormData {
  parentName: string;
  babyGender: 'boy' | 'girl' | 'neutral';
  birthDate: string;
  lastName: string;
}

export default function AdvisorForm({ onStart }: AdvisorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    babyGender: 'neutral',
    birthDate: '',
    lastName: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra Ngày sinh
    const selectedDate = new Date(formData.birthDate);
    const today = new Date();
    // Giới hạn chọn ngày (không quá 100 năm trước và 5 năm sau - dự kiến sinh)
    if (selectedDate > new Date(today.getFullYear() + 5, 11, 31) || selectedDate < new Date(today.getFullYear() - 100, 0, 1)) {
      setError('Ngày sinh không hợp lệ.');
      return;
    }

    if (formData.parentName.trim().length < 2) {
      setError('Họ nhập vào quá ngắn.');
      return;
    }

    // Tách họ (loại bỏ ký tự đặc biệt)
    const rawLastName = formData.parentName.trim();
    const lastName = rawLastName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
      .replace(/[^a-zA-Z\s]/g, '') // Chỉ giữ chữ và khoảng trắng
      .split(' ')[0]
      .toUpperCase();

    if (!lastName) {
      setError('Họ chứa ký tự không hợp lệ.');
      return;
    }

    onStart({ ...formData, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-advisor-100 flex flex-col gap-6">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium flex items-center gap-2">
          <XCircle size={18} /> {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
          <User size={16} /> Họ của Bố hoặc Mẹ
        </label>
        <input
          type="text"
          required
          value={formData.parentName}
          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          placeholder="Ví dụ: NGUYEN"
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 text-slate-900 transition-all"
        />
        <p className="text-[10px] text-advisor-400 italic">* Hệ thống sẽ dùng họ này để tính toán số thiếu cho bé.</p>
      </div>

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
