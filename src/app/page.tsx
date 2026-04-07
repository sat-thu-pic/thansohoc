'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, XCircle, MessageSquare } from 'lucide-react';
import AdvisorForm, { FormData } from '@/components/forms/AdvisorForm';
import EnergyGrid from '@/components/visuals/EnergyGrid';
import NameCard from '@/components/cards/NameCard';
import { mapNameToNumbers, calculateLifePath } from '@/lib/numerology';
import { generateBitmask, getMissingNumbers, filterBalancedNames, NameRecord } from '@/lib/bitmask';
import middleNames from '@/data/middleNames.json';
import firstNames from '@/data/firstNames.json';

export default function Home() {
  const [inputData, setInputData] = useState<FormData | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [storytelling, setStorytelling] = useState<string | null>(null);
  const [isAIHeading, setIsAIHeading] = useState(false);

  const analysis = useMemo(() => {
    if (!inputData) return null;
    const lastNameNumbers = mapNameToNumbers(inputData.lastName);
    const lastNameMask = generateBitmask(lastNameNumbers);
    const lifePath = calculateLifePath(inputData.birthDate);
    const missingNumbers = getMissingNumbers(lastNameMask);
    
    // Tạo tổ hợp Tên đệm + Tên chính linh hoạt
    const allPossibleNames: NameRecord[] = [];
    
    middleNames.forEach(m => {
      // Lọc giới tính cho tên đệm
      if (m.gender !== 'neutral' && m.gender !== inputData.babyGender) return;
      
      firstNames.forEach(f => {
        // Lọc giới tính cho tên chính
        if (f.gender !== 'neutral' && f.gender !== inputData.babyGender) return;
        
        allPossibleNames.push({
          name: `${m.name} ${f.name}`,
          gender: inputData.babyGender,
          mask: m.mask | f.mask,
          meaning: `${m.meaning} kết hợp với ${f.meaning.toLowerCase()}.`
        });
      });
    });

    // Lọc các tên bù đắp đủ số thiếu
    let suggestedNames = filterBalancedNames(lastNameMask, allPossibleNames);
    
    // Nếu không có tên cân bằng tuyệt đối, lấy các tên bù đắp được nhiều nhất
    if (suggestedNames.length === 0) {
      suggestedNames = allPossibleNames
        .sort((a, b) => {
          const aContribution = (a.mask & ~lastNameMask).toString(2).split('1').length - 1;
          const bContribution = (b.mask & ~lastNameMask).toString(2).split('1').length - 1;
          return bContribution - aContribution;
        })
        .slice(0, 6);
    } else {
      // Nếu có quá nhiều tên cân bằng, chỉ lấy ngẫu nhiên hoặc top 10
      suggestedNames = suggestedNames.slice(0, 10);
    }

    return {
      lastNameMask,
      lifePath,
      missingNumbers,
      suggestedNames
    };
  }, [inputData]);

  const handleStart = (data: FormData) => {
    setInputData(data);
    setStorytelling(null);
    setSelectedName(null);
  };

  const handleFetchStorytelling = async (name: string) => {
    if (!inputData || !analysis) return;
    setIsAIHeading(true);
    setSelectedName(name);
    try {
      const res = await fetch('/api/storytelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastName: inputData.lastName,
          name: name,
          birthDate: inputData.birthDate,
          lifePath: analysis.lifePath,
          missingNumbers: analysis.missingNumbers
        }),
      });
      const data = await res.json();
      setStorytelling(data.storytelling);
    } catch (error) {
      console.error(error);
      setStorytelling('Có lỗi xảy ra khi kết nối với AI Advisor.');
    } finally {
      setIsAIHeading(false);
    }
  };

  if (!inputData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-advisor-50 to-white">
        <div className="flex flex-col items-center gap-6 mb-12 text-center">
          <div className="bg-advisor-600 p-4 rounded-3xl text-white shadow-xl shadow-advisor-200">
            <Sparkles size={48} />
          </div>
          <h1 className="text-5xl font-black text-advisor-900 tracking-tight">Naming Advisor</h1>
          <p className="text-xl text-advisor-700 max-w-xl">
            Cố vấn Thần số học chuyên sâu giúp cha mẹ tìm thấy cái tên cân bằng tuyệt đối cho bé.
          </p>
        </div>
        <AdvisorForm onStart={handleStart} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-50">
      <div className="w-full max-w-5xl">
        <button 
          onClick={() => setInputData(null)}
          className="mb-8 flex items-center gap-2 text-advisor-600 font-bold hover:text-advisor-800 transition-all"
        >
          <ArrowLeft size={20} /> QUAY LẠI
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Analysis */}
          <div className="flex flex-col gap-8">
            <EnergyGrid mask={analysis!.lastNameMask} lifePath={analysis!.lifePath} />
            <div className="bg-white p-6 rounded-2xl border border-advisor-100 shadow-lg">
              <h4 className="font-bold text-advisor-900 mb-4 flex items-center gap-2">
                <RefreshCw size={18} className="text-advisor-500" /> Phân tích số thiếu
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis!.missingNumbers.map(n => (
                  <span key={n} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-bold text-sm border border-rose-100">
                    Số {n}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                Họ {inputData.lastName} mang rung động mạnh nhưng thiếu các năng lượng trên. Những cái tên gợi ý sẽ giúp bù đắp để đạt sự cân bằng 1-9.
              </p>
            </div>
          </div>

          {/* Main Content: Suggested Names */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-3xl font-black text-advisor-900 uppercase tracking-tight mb-2">
              Gợi ý tên cân bằng
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis!.suggestedNames.map((name) => (
                <NameCard 
                  key={name.name}
                  name={name.name}
                  meaning={name.meaning}
                  isLoading={isAIHeading && selectedName === name.name}
                  onSelect={() => handleFetchStorytelling(name.name)}
                />
              ))}
            </div>

            {/* AI Storytelling Result */}
            {storytelling && (
              <div className="mt-8 bg-white p-8 rounded-3xl border-2 border-advisor-500 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-advisor-100 group-hover:text-advisor-200 transition-colors">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-advisor-900 flex items-center gap-3">
                      <MessageSquare className="text-advisor-600" /> Hồ sơ tên: {selectedName}
                    </h3>
                    <button onClick={() => setStorytelling(null)} className="text-slate-400 hover:text-rose-500">
                      <XCircle size={24} />
                    </button>
                  </div>
                  <div className="text-advisor-800 leading-relaxed whitespace-pre-line text-lg font-medium italic">
                    {storytelling}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
