'use client';

import React, { useState } from 'react';
import { User, Baby, Calendar, Search } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.lastName && formData.birthDate) {
      onStart(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-advisor-100 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
          <User size={16} /> Họ tên Bố hoặc Mẹ
        </label>
        <input
          type="text"
          value={formData.parentName}
          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          placeholder="Ví dụ: Nguyễn Văn A"
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 transition-all"
        />
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
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-advisor-700 flex items-center gap-2">
          <Search size={16} /> Họ của bé (Ví dụ: NGUYEN)
        </label>
        <input
          type="text"
          required
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
          placeholder="Nhập họ của bé"
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-advisor-500 font-bold transition-all"
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
