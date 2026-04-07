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
  const [filterType, setFilterType] = useState<'all' | 'father' | 'mother'>('all');

  const analysis = useMemo(() => {
    if (!inputData) return null;

    const toTitleCase = (str: string) => {
      return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const fatherLast = inputData.parentName.trim();
    const motherLast = inputData.motherLastName.trim();

    // Tính toán số thiếu dựa trên tổng năng lượng của cả 2 họ (dùng bản không dấu để tính)
    const combinedLastName = `${fatherLast} ${motherLast}`;
    const lastNameNumbers = mapNameToNumbers(combinedLastName);
    const lastNameMask = generateBitmask(lastNameNumbers);
    const lifePath = calculateLifePath(inputData.birthDate);
    const missingNumbers = getMissingNumbers(lastNameMask);

    // Tạo tổ hợp Tên đệm + Tên chính linh hoạt
    const fatherLastTitle = toTitleCase(fatherLast);
    const motherLastTitle = toTitleCase(motherLast);
    
    // Tạo danh sách tất cả các tổ hợp tên lót + tên chính cân bằng
    const possibleCombinations: { name: string, mask: number, meaning: string }[] = [];
    
    middleNames.forEach(m => {
      if (m.gender !== 'neutral' && m.gender !== inputData.babyGender) return;
      firstNames.forEach(f => {
        if (f.gender !== 'neutral' && f.gender !== inputData.babyGender) return;
        possibleCombinations.push({
          name: `${m.name} ${f.name}`,
          mask: m.mask | f.mask,
          meaning: `${m.meaning} kết hợp với ${f.meaning.toLowerCase()}.`
        });
      });
    });

    // Tính toán cho trường hợp bé mang Họ Bố
    const fatherLastNumbers = mapNameToNumbers(fatherLast);
    const fatherLastMask = generateBitmask(fatherLastNumbers);
    const fatherSuggested = [...possibleCombinations]
      .sort((a, b) => {
        const aContribution = (a.mask & ~fatherLastMask).toString(2).split('1').length - 1;
        const bContribution = (b.mask & ~fatherLastMask).toString(2).split('1').length - 1;
        return bContribution - aContribution;
      })
      .slice(0, 10)
      .map(comb => ({
        name: `${fatherLastTitle} ${comb.name}`,
        gender: inputData.babyGender,
        mask: comb.mask,
        meaning: comb.meaning,
        type: 'father'
      }));

    // Tính toán cho trường hợp bé mang Họ Mẹ
    const motherLastNumbers = mapNameToNumbers(motherLast);
    const motherLastMask = generateBitmask(motherLastNumbers);
    const motherSuggested = [...possibleCombinations]
      .sort((a, b) => {
        const aContribution = (a.mask & ~motherLastMask).toString(2).split('1').length - 1;
        const bContribution = (b.mask & ~motherLastMask).toString(2).split('1').length - 1;
        return bContribution - aContribution;
      })
      .slice(0, 10)
      .map(comb => ({
        name: `${motherLastTitle} ${comb.name}`,
        gender: inputData.babyGender,
        mask: comb.mask,
        meaning: comb.meaning,
        type: 'mother'
      }));

    // Gộp cả 2 danh sách lại
    const allNames = [...fatherSuggested, ...motherSuggested];

    return {
      lastNameMask: fatherLastMask | motherLastMask,
      fatherMask: fatherLastMask,
      motherMask: motherLastMask,
      lifePath,
      missingNumbers,
      allNames,
      fatherLast: fatherLastTitle,
      motherLast: motherLastTitle
    };
  }, [inputData]);

  const currentMask = useMemo(() => {
    if (!analysis) return 0;
    if (filterType === 'all') return analysis.lastNameMask;
    if (filterType === 'father') return analysis.fatherMask;
    return analysis.motherMask;
  }, [analysis, filterType]);

  const currentMissingNumbers = useMemo(() => {
    return getMissingNumbers(currentMask);
  }, [currentMask]);

  const filteredNames = useMemo(() => {
    if (!analysis) return [];
    if (filterType === 'all') return analysis.allNames;
    return analysis.allNames.filter(n => (n as any).type === filterType);
  }, [analysis, filterType]);

  const handleStart = (data: FormData) => {
    setInputData(data);
    setStorytelling(null);
    setSelectedName(null);
    setFilterType('all'); // Reset filter khi bắt đầu tư vấn mới
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
            <EnergyGrid mask={currentMask} lifePath={analysis!.lifePath} />
            <div className="bg-white p-6 rounded-2xl border border-advisor-100 shadow-lg">
              <h4 className="font-bold text-advisor-900 mb-4 flex items-center gap-2">
                <RefreshCw size={18} className="text-advisor-500" /> Phân tích số thiếu
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentMissingNumbers.map(n => (
                  <span key={n} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-bold text-sm border border-rose-100">
                    Số {n}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                {filterType === 'all' ? 'Tổng hợp cả hai họ' : `Họ ${filterType === 'father' ? analysis!.fatherLast : analysis!.motherLast}`} mang năng lượng mạnh nhưng thiếu các rung động trên. Những cái tên gợi ý sẽ giúp bù đắp để đạt sự cân bằng 1-9.
              </p>
            </div>
          </div>

          {/* Main Content: Suggested Names */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
              <div>
                <h2 className="text-3xl font-black text-advisor-900 uppercase tracking-tight">
                  Gợi ý tên cân bằng
                </h2>
                <p className="text-advisor-500 text-sm italic">Nhấn vào thẻ tên để xem Storytelling từ AI</p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex bg-white p-1 rounded-xl border border-advisor-100 shadow-sm">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filterType === 'all' ? 'bg-advisor-600 text-white shadow-md' : 'text-advisor-400 hover:text-advisor-600'
                  }`}
                >
                  TẤT CẢ
                </button>
                <button
                  onClick={() => setFilterType('father')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filterType === 'father' ? 'bg-advisor-600 text-white shadow-md' : 'text-advisor-400 hover:text-advisor-600'
                  }`}
                >
                  HỌ BỐ ({analysis.fatherLast})
                </button>
                <button
                  onClick={() => setFilterType('mother')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filterType === 'mother' ? 'bg-advisor-600 text-white shadow-md' : 'text-advisor-400 hover:text-advisor-600'
                  }`}
                >
                  HỌ MẸ ({analysis.motherLast})
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNames.map((name: any) => (
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
