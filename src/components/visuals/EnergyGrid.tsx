'use client';

import React from 'react';

interface EnergyGridProps {
  mask: number;
}

export default function EnergyGrid({ mask }: EnergyGridProps) {
  // Thứ tự hiển thị 3x3 chuẩn Pytago:
  // 3 6 9
  // 2 5 8
  // 1 4 7
  const gridLayout = [3, 6, 9, 2, 5, 8, 1, 4, 7];

  return (
    <section className="bg-surface-container-low rounded-xl p-8 transition-all hover:bg-surface-container duration-500 w-full">
      <h3 className="font-label text-[11px] font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-8 text-center md:text-left">Biểu đồ năng lượng Ngày sinh</h3>
      <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
        {gridLayout.map((num) => {
          const isPresent = (mask & (1 << (num - 1))) !== 0;
          return (
            <div
              key={num}
              className={`aspect-square flex items-center justify-center rounded-full font-headline font-bold text-lg transition-all ${
                isPresent
                  ? 'bg-primary-container text-on-primary-container shadow-sm transform hover:scale-105'
                  : 'text-outline-variant'
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>
    </section>
  );
}
