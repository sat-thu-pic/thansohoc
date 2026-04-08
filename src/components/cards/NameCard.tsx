import React, { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(isSuggested);

  return (
    <div className={`rounded-xl transition-all duration-300 flex flex-col overflow-hidden relative shadow-sm ${
      isExpanded 
        ? "bg-surface-container-lowest border-l-4 border-primary" 
        : "bg-surface-container-low hover:bg-surface-container-high"
    }`}>
      <div className={`p-6 md:p-8 ${isExpanded ? "pb-4" : ""}`}>
        {isExpanded && (
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-9xl">auto_awesome</span>
          </div>
        )}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h3 className={`headline-serif font-bold text-on-surface ${isExpanded ? "text-3xl" : "text-2xl"}`}>{name}</h3>
            {isExpanded && isSuggested && (
               <div className="flex gap-2">
                 <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold uppercase rounded-md tracking-widest leading-normal">
                   Perfect Match
                 </span>
               </div>
            )}
          </div>
          
          {!isExpanded && (
            <div className="flex flex-wrap gap-2 mb-2">
              {numbers.slice().sort((a,b)=>a-b).map((num) => (
                <span key={num} className="w-8 h-8 flex items-center justify-center bg-surface-container-lowest rounded text-[10px] font-bold text-primary">
                  {num}
                </span>
              ))}
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="max-w-2xl mb-10 mt-4">
                <p className="headline-serif text-xl md:text-2xl italic text-on-surface-variant leading-relaxed">
                  "{analysis.intro}"
                </p>
              </div>

              <div className="mb-10">
                <h4 className="font-label text-[11px] font-extrabold tracking-[0.2em] uppercase text-primary mb-6">Phân tích tên</h4>
                
                {analysis.nameBreakdown.map((part, idx) => (
                  <div key={idx} className="mb-8">
                    <h5 className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-4 opacity-70 border-b border-outline-variant/20 pb-2">{part.part}: {part.name}</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-outline-variant/10">
                            <th className="pb-3 px-2 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Chữ cái</th>
                            <th className="pb-3 px-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Số học</th>
                            <th className="pb-3 pr-2 text-right font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Năng lượng</th>
                          </tr>
                        </thead>
                        <tbody className="font-body text-sm">
                          {part.letters.map((item, i) => (
                            <tr key={i} className="hover:bg-surface-container-low transition-colors group/row border-b border-outline-variant/5 last:border-0">
                              <td className="py-3 px-2 font-headline font-bold text-lg">{item.letter}</td>
                              <td className="py-3 px-4 font-headline font-bold text-lg text-primary">{item.number}</td>
                              <td className="py-3 pr-2 text-right text-on-surface-variant">{item.meaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-primary-fixed/30 p-6 rounded-xl mt-2">
                <p className="text-on-primary-fixed-variant text-sm font-medium italic">
                  {analysis.conclusion}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 border-t border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors flex items-center justify-center gap-2 mt-auto"
      >
        <span className="text-[10px] font-bold font-label uppercase tracking-widest text-primary">
          {isExpanded ? "Thu gọn ∧" : "Phân tích chi tiết ∨"}
        </span>
      </button>
    </div>
  );
}
