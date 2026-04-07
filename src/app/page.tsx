'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, RefreshCw, Sparkles, XCircle } from 'lucide-react';
import AdvisorForm, { FormData } from '@/components/forms/AdvisorForm';
import NameCard from '@/components/cards/NameCard';
import EnergyGrid from '@/components/visuals/EnergyGrid';
import firstNames from '@/data/firstNames.json';
import middleNames from '@/data/middleNames.json';
import { generateBitmask, getMissingNumbers } from '@/lib/bitmask';
import { calculateLifePath, getDateDigits, mapNameToNumbers } from '@/lib/numerology';

const FULL_MASK = 511;

type FilterType = 'suggested' | 'father' | 'mother' | 'combined';

type SuggestedName = {
  name: string;
  meaning: string;
  mask: number;
  type: Exclude<FilterType, 'suggested'>;
};

type NameCombination = {
  firstName: string;
  middleName: string;
  name: string;
  mask: number;
  meaning: string;
};

export default function Home() {
  const [inputData, setInputData] = useState<FormData | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [storytelling, setStorytelling] = useState<string | null>(null);
  const [isAIHeading, setIsAIHeading] = useState(false);
  const [aiSuggestedName, setAiSuggestedName] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('suggested');

  const analysis = useMemo(() => {
    if (!inputData) return null;

    const toTitleCase = (value: string) =>
      value
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const normalizePart = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

    const countBits = (mask: number) => mask.toString(2).split('1').length - 1;

    const fatherLast = inputData.parentName.trim();
    const motherLast = inputData.motherLastName.trim();
    const fatherLastTitle = toTitleCase(fatherLast);
    const motherLastTitle = toTitleCase(motherLast);

    const lifePath = calculateLifePath(inputData.birthDate);
    const birthDateMask = generateBitmask(getDateDigits(inputData.birthDate));
    const missingNumbers = getMissingNumbers(birthDateMask);

    const fatherLastMask = generateBitmask(mapNameToNumbers(fatherLast));
    const motherLastMask = generateBitmask(mapNameToNumbers(motherLast));

    const possibleCombinations: NameCombination[] = [];
    middleNames.forEach((middle) => {
      if (middle.gender !== 'neutral' && middle.gender !== inputData.babyGender) return;

      firstNames.forEach((first) => {
        if (first.gender !== 'neutral' && first.gender !== inputData.babyGender) return;

        possibleCombinations.push({
          firstName: first.name.trim(),
          middleName: middle.name.trim(),
          name: `${middle.name} ${first.name}`.trim(),
          mask: middle.mask | first.mask,
          meaning: `${middle.meaning} kết hợp với ${first.meaning.toLowerCase()}.`,
        });
      });
    });

    const createSuggestions = (
      prefix: string,
      surnameMask: number,
      type: Exclude<FilterType, 'suggested'>
    ): SuggestedName[] => {
      const baseMask = birthDateMask | surnameMask;
      const missingMask = FULL_MASK ^ baseMask;
      const surnameParts = prefix.split(' ').map(normalizePart).filter(Boolean);

      return possibleCombinations
        .filter((combination) => {
          const normalizedMiddle = normalizePart(combination.middleName);
          const normalizedFirst = normalizePart(combination.firstName);

          if (normalizedMiddle === normalizedFirst) return false;
          if (surnameParts.includes(normalizedMiddle) || surnameParts.includes(normalizedFirst)) {
            return false;
          }

          return true;
        })
        .filter((combination) => (baseMask | combination.mask) === FULL_MASK)
        .sort((a, b) => {
          const aCoverage = countBits(a.mask & missingMask);
          const bCoverage = countBits(b.mask & missingMask);
          if (aCoverage !== bCoverage) return bCoverage - aCoverage;

          const aRedundancy = countBits(a.mask) - aCoverage;
          const bRedundancy = countBits(b.mask) - bCoverage;
          if (aRedundancy !== bRedundancy) return aRedundancy - bRedundancy;

          return a.name.localeCompare(b.name, 'vi');
        })
        .slice(0, 10)
        .map((combination) => ({
          name: `${prefix} ${combination.name}`.trim(),
          meaning: combination.meaning,
          mask: surnameMask | combination.mask,
          type,
        }));
    };

    const fatherSuggested = createSuggestions(fatherLastTitle, fatherLastMask, 'father');
    const motherSuggested = createSuggestions(motherLastTitle, motherLastMask, 'mother');
    const combinedSuggested = createSuggestions(
      `${fatherLastTitle} ${motherLastTitle}`.trim(),
      fatherLastMask | motherLastMask,
      'combined'
    );

    const allNames =
      fatherLastTitle === motherLastTitle
        ? fatherSuggested
        : [...fatherSuggested, ...motherSuggested, ...combinedSuggested];

    return {
      allNames,
      birthDateMask,
      fatherLast: fatherLastTitle,
      isSameLast: fatherLastTitle === motherLastTitle,
      lifePath,
      missingNumbers,
      motherLast: motherLastTitle,
    };
  }, [inputData]);

  const currentMask = useMemo(() => {
    if (!analysis) return 0;
    return analysis.birthDateMask;
  }, [analysis]);

  const filteredNames = useMemo(() => {
    if (!analysis) return [];
    if (filterType === 'suggested') {
      if (analysis.allNames.length === 0) return [];
      if (!aiSuggestedName) return [analysis.allNames[0]];

      const matched = analysis.allNames.find((name) => name.name === aiSuggestedName);
      return matched ? [matched] : [analysis.allNames[0]];
    }

    return analysis.allNames.filter((name) => name.type === filterType);
  }, [aiSuggestedName, analysis, filterType]);

  useEffect(() => {
    let cancelled = false;

    const selectBestName = async () => {
      if (!analysis || !inputData || analysis.allNames.length === 0) {
        setAiSuggestedName(null);
        return;
      }

      try {
        const response = await fetch('/api/suggest-best', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birthDate: inputData.birthDate,
            lifePath: analysis.lifePath,
            missingNumbers: analysis.missingNumbers,
            candidates: analysis.allNames.map((name) => ({
              name: name.name,
              meaning: name.meaning,
              type: name.type,
            })),
          }),
        });

        const data = await response.json();
        if (!cancelled) {
          setAiSuggestedName(data.selectedName ?? null);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setAiSuggestedName(null);
        }
      }
    };

    void selectBestName();

    return () => {
      cancelled = true;
    };
  }, [analysis, inputData]);

  const handleStart = (data: FormData) => {
    setInputData(data);
    setSelectedName(null);
    setStorytelling(null);
    setAiSuggestedName(null);
    setFilterType('suggested');
  };

  const handleFetchStorytelling = async (name: string) => {
    if (!inputData || !analysis) return;

    setIsAIHeading(true);
    setSelectedName(name);

    try {
      const response = await fetch('/api/storytelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastName: inputData.lastName,
          name,
          birthDate: inputData.birthDate,
          lifePath: analysis.lifePath,
          missingNumbers: analysis.missingNumbers,
        }),
      });

      const data = await response.json();
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-advisor-50 to-white p-6">
        <div className="mb-12 flex flex-col items-center gap-6 text-center">
          <div className="rounded-3xl bg-advisor-600 p-4 text-white shadow-xl shadow-advisor-200">
            <Sparkles size={48} />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-advisor-900">Naming Advisor</h1>
          <p className="max-w-xl text-xl text-advisor-700">
            Công cụ gợi ý tên cân bằng thần số học cho bé dựa trên ngày sinh và họ của bố mẹ.
          </p>
        </div>
        <AdvisorForm onStart={handleStart} />
      </main>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-6">
      <div className="w-full max-w-5xl">
        <button
          onClick={() => setInputData(null)}
          className="mb-8 flex items-center gap-2 font-bold text-advisor-600 transition-all hover:text-advisor-800"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8">
            <EnergyGrid mask={currentMask} lifePath={analysis.lifePath} />
            <div className="rounded-2xl border border-advisor-100 bg-white p-6 shadow-lg">
              <h4 className="mb-4 flex items-center gap-2 font-bold text-advisor-900">
                <RefreshCw size={18} className="text-advisor-500" /> Số thiếu theo ngày sinh
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingNumbers.map((number) => (
                  <span
                    key={number}
                    className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600"
                  >
                    Số {number}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-slate-500">
                Các tên dưới đây chỉ được giữ lại khi ghép với ngày sinh và họ tương ứng tạo thành
                bộ mask đủ từ 1 đến 9.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-advisor-900">
                  Gợi ý tên cân bằng
                </h2>
              </div>

              <div className="flex rounded-xl border border-advisor-100 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setFilterType('suggested')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    filterType === 'suggested'
                      ? 'bg-advisor-600 text-white shadow-md'
                      : 'text-advisor-400 hover:text-advisor-600'
                  }`}
                >
                  Gợi ý
                </button>
                <button
                  onClick={() => setFilterType('father')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    filterType === 'father'
                      ? 'bg-advisor-600 text-white shadow-md'
                      : 'text-advisor-400 hover:text-advisor-600'
                  }`}
                >
                  Họ bố ({analysis.fatherLast})
                </button>
                {!analysis.isSameLast && (
                  <button
                    onClick={() => setFilterType('combined')}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      filterType === 'combined'
                        ? 'bg-advisor-600 text-white shadow-md'
                        : 'text-advisor-400 hover:text-advisor-600'
                    }`}
                  >
                    Ghép họ ({analysis.fatherLast} {analysis.motherLast})
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredNames.map((name) => {
                const nameNumbers: number[] = [];
                for (let i = 1; i <= 9; i += 1) {
                  if (name.mask & (1 << (i - 1))) {
                    nameNumbers.push(i);
                  }
                }

                return (
                  <div key={name.name} className="relative">
                    <NameCard
                      name={name.name}
                      meaning={name.meaning}
                      numbers={nameNumbers}
                      isLoading={isAIHeading && selectedName === name.name}
                      onSelect={() => handleFetchStorytelling(name.name)}
                    />
                  </div>
                );
              })}
            </div>

            {storytelling && (
              <div className="group relative mt-8 overflow-hidden rounded-3xl border-2 border-advisor-500 bg-white p-8 shadow-2xl">
                <div className="absolute right-0 top-0 p-4 text-advisor-100 transition-colors group-hover:text-advisor-200">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-3 text-2xl font-black text-advisor-900">
                      <MessageSquare className="text-advisor-600" /> Hồ sơ tên: {selectedName}
                    </h3>
                    <button
                      onClick={() => setStorytelling(null)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                  <div className="whitespace-pre-line text-lg font-medium italic leading-relaxed text-advisor-800">
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
