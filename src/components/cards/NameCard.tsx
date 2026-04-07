'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface NameCardProps {
  name: string;
  meaning: string;
  onSelect: () => void;
  isLoading?: boolean;
}

export default function NameCard({ name, meaning, onSelect, isLoading }: NameCardProps) {
  return (
    <div 
      onClick={onSelect}
      className={`bg-white p-6 rounded-2xl border-2 transition-all flex flex-col gap-4 group cursor-pointer active:scale-95 ${
        isLoading ? 'border-advisor-500 shadow-md' : 'border-advisor-100 shadow-sm hover:border-advisor-300 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-2xl font-black text-advisor-900 group-hover:text-advisor-600 transition-colors">{name}</h4>
        <div className="p-2 bg-advisor-50 text-advisor-500 rounded-lg">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
        </div>
      </div>
      
      <p className="text-advisor-600 text-sm leading-relaxed italic border-l-2 border-advisor-200 pl-4">
        {meaning}
      </p>
    </div>
  );
}
