'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Loader2 } from 'lucide-react';

interface NameCardProps {
  name: string;
  meaning: string;
  onSelect: () => void;
  isLoading?: boolean;
}

export default function NameCard({ name, meaning, onSelect, isLoading }: NameCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-advisor-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
      <div className="flex justify-between items-start">
        <h4 className="text-2xl font-black text-advisor-900 group-hover:text-advisor-600 transition-colors">{name}</h4>
        <div className="p-2 bg-advisor-50 text-advisor-500 rounded-lg">
          <Sparkles size={18} />
        </div>
      </div>
      
      <p className="text-advisor-600 text-sm leading-relaxed italic border-l-2 border-advisor-200 pl-4">
        {meaning}
      </p>

      <button
        onClick={onSelect}
        disabled={isLoading}
        className="mt-2 flex items-center justify-center gap-2 bg-advisor-50 hover:bg-advisor-100 text-advisor-700 font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <MessageSquare size={18} />
            Xem Storytelling
          </>
        )}
      </button>
    </div>
  );
}
