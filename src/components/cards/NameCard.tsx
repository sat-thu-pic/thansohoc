'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NameCardProps {
  name: string;
  numbers: number[];
  storytelling: string;
  isSuggested?: boolean;
}

export default function NameCard({
  name,
  numbers,
  storytelling,
  isSuggested = false,
}: NameCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`group flex flex-col gap-4 rounded-2xl border-2 bg-white p-6 transition-all ${
        isSuggested
          ? 'border-advisor-500 shadow-lg'
          : 'border-advisor-100 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <h4 className="whitespace-pre-line text-xl font-black leading-relaxed text-advisor-900">
          {name}
        </h4>
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

      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 rounded-lg bg-advisor-50 px-4 py-2 text-sm font-bold text-advisor-700 transition-colors hover:bg-advisor-100"
      >
        <span>Phân tích tên</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && (
        <div className="rounded-xl bg-advisor-50 p-4">
          <p className="text-sm leading-relaxed text-advisor-800">
            {storytelling}
          </p>
        </div>
      )}
    </div>
  );
}
