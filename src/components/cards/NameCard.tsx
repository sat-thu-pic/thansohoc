'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NameAnalysis } from '@/lib/storytelling';

interface NameCardProps {
  name: string;
  numbers: number[];
  analysis: NameAnalysis;
  isSuggested?: boolean;
}

export default function NameCard({
  name,
  numbers,
  analysis,
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
        <span className="ml-1 self-center text-[10px] italic text-advisor-400">
          Rung động bổ trợ
        </span>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 rounded-lg bg-advisor-50 px-4 py-2 text-sm font-bold text-advisor-700 transition-colors hover:bg-advisor-100"
      >
        <span>Phân tích tên</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {/* Intro */}
          <p className="text-sm leading-relaxed text-advisor-800">{analysis.intro}</p>

          {/* Life Path */}
          <p className="text-sm font-medium text-advisor-700">{analysis.lifePathSection}</p>

          {/* Table for each name part */}
          {analysis.nameBreakdown.map((part, idx) => (
            <div key={idx} className="rounded-lg border border-advisor-100 overflow-hidden">
              <div className="bg-advisor-50 px-3 py-2 text-sm font-bold text-advisor-700">
                {part.part}: {part.name}
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {part.letters.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-1.5 font-mono font-bold text-advisor-600 w-12 text-center">
                        {item.letter}
                      </td>
                      <td className="px-3 py-1.5 text-slate-500 w-8 text-center">→</td>
                      <td className="px-3 py-1.5 font-bold text-advisor-600 w-16 text-center">
                        {item.number}
                      </td>
                      <td className="px-3 py-1.5 text-advisor-800">
                        {item.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Balance */}
          <p className="text-sm font-medium text-advisor-700">{analysis.balanceSection}</p>

          {/* Conclusion */}
          <p className="text-sm italic text-advisor-600">{analysis.conclusion}</p>
        </div>
      )}
    </div>
  );
}
