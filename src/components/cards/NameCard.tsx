'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface NameCardProps {
  name: string;
  meaning: string;
  numbers: number[];
  onSelect: () => void;
  isLoading?: boolean;
}

export default function NameCard({
  name,
  meaning,
  numbers,
  onSelect,
  isLoading,
}: NameCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group flex cursor-pointer flex-col gap-4 rounded-2xl border-2 bg-white p-6 transition-all active:scale-95 ${
        isLoading
          ? 'border-advisor-500 shadow-md'
          : 'border-advisor-100 shadow-sm hover:border-advisor-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <h4 className="whitespace-pre-line text-xl font-black leading-relaxed text-advisor-900 transition-colors group-hover:text-advisor-600">
          {name}
        </h4>
        <div className="shrink-0 rounded-lg bg-advisor-50 p-2 text-advisor-500">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {numbers
          .slice()
          .sort((a, b) => a - b)
          .map((num) => (
            <span
              key={num}
              className="flex h-6 w-6 items-center justify-center rounded border border-advisor-100 bg-advisor-50 text-[10px] font-bold text-advisor-600"
            >
              {num}
            </span>
          ))}
        <span className="ml-1 self-center text-[10px] italic text-advisor-400">
          Rung động bổ trợ
        </span>
      </div>

      <p className="border-l-2 border-advisor-200 pl-4 text-sm italic leading-relaxed text-advisor-600">
        {meaning}
      </p>
    </div>
  );
}
