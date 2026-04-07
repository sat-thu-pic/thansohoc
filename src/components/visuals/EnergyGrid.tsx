'use client';

import React from 'react';

interface EnergyGridProps {
  mask: number;
  lifePath: number;
}

export default function EnergyGrid({ mask, lifePath }: EnergyGridProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Thứ tự hiển thị 3x3 chuẩn Pytago:
  // 3 6 9
  // 2 5 8
  // 1 4 7
  const gridLayout = [3, 6, 9, 2, 5, 8, 1, 4, 7];

  return (
    <div className="flex flex-col items-center gap-8 bg-white p-8 rounded-2xl border border-advisor-100 shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-bold text-advisor-900 mb-2">Biểu đồ năng lượng của Họ</h3>
        <p className="text-sm text-advisor-500 italic">Các ô màu đỏ là những rung động bé đang còn thiếu</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {gridLayout.map((num) => {
          const isPresent = (mask & (1 << (num - 1))) !== 0;
          return (
            <div
              key={num}
              className={`w-16 h-16 flex items-center justify-center rounded-xl border-2 text-xl font-bold transition-all ${
                isPresent
                  ? 'bg-advisor-50 border-advisor-500 text-advisor-900 shadow-inner'
                  : 'bg-rose-50 border-rose-200 text-rose-300'
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>

      <div className="w-full h-px bg-slate-100" />

      <div className="flex items-center gap-4 bg-advisor-50 px-6 py-4 rounded-xl border border-advisor-200">
        <div className="w-12 h-12 bg-advisor-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-md">
          {lifePath}
        </div>
        <div>
          <h4 className="font-bold text-advisor-900 uppercase text-sm tracking-widest">Con số chủ đạo</h4>
          <p className="text-advisor-700 text-xs">Vận mệnh cốt lõi của bé dựa trên ngày sinh</p>
        </div>
      </div>
    </div>
  );
}
