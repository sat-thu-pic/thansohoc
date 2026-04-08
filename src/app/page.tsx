'use client';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import AdvisorForm, { FormData } from '@/components/forms/AdvisorForm';
import NameCard from '@/components/cards/NameCard';
import EnergyGrid from '@/components/visuals/EnergyGrid';
import firstNames from '@/data/firstNames.json';
import middleNames from '@/data/middleNames.json';
import { generateBitmask, getMissingNumbers } from '@/lib/bitmask';
import { calculateLifePath, getDateDigits, mapNameToNumbers } from '@/lib/numerology';
import {
  generateNameAnalysis,
  getMissingNumbersNarrative,
} from '@/lib/storytelling';

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

    // Calculate present numbers (numbers in birth date)
    const presentNumbers: number[] = [];
    for (let i = 1; i <= 9; i += 1) {
      if (!missingNumbers.includes(i)) {
        presentNumbers.push(i);
      }
    }

    return {
      allNames,
      birthDateMask,
      fatherLast: fatherLastTitle,
      isSameLast: fatherLastTitle === motherLastTitle,
      lifePath,
      missingNumbers,
      motherLast: motherLastTitle,
      presentNumbers,
    };
  }, [inputData]);

  const currentMask = useMemo(() => {
    if (!analysis) return 0;
    return analysis.birthDateMask;
  }, [analysis]);

  const filteredNames = useMemo(() => {
    if (!analysis) return [];
    if (filterType === 'suggested') {
      // Fallback: use the first name from allNames as suggested
      if (analysis.allNames.length === 0) return [];
      return [analysis.allNames[0]];
    }

    return analysis.allNames.filter((name) => name.type === filterType);
  }, [analysis, filterType]);

  // Generate storytelling for each name
  const namesWithStorytelling = useMemo(() => {
    if (!analysis) return [];

    return filteredNames.map((nameData, index) => {
      // Extract first name and middle name from the full name
      const nameParts = nameData.name.split(' ');
      const firstName = nameParts[nameParts.length - 1] || '';
      const middleName = nameParts.slice(1, -1).join(' ') || '';

      // Find meanings from data
      const firstNameData = firstNames.find(
        (f) => f.name.toLowerCase() === firstName.toLowerCase()
      );
      const middleNameData = middleNames.find(
        (m) => m.name.toLowerCase() === middleName.toLowerCase()
      );

      // Calculate filled numbers (numbers that the name contributes to fill missing)
      const filledNumbers: number[] = [];
      for (let i = 1; i <= 9; i += 1) {
        if (analysis.missingNumbers.includes(i) && (nameData.mask & (1 << (i - 1)))) {
          filledNumbers.push(i);
        }
      }

      // Extract surname (first word of full name)
      const surname = nameParts[0] || '';

      const nameAnalysis = generateNameAnalysis(
        surname,
        middleName,
        firstName,
        middleNameData?.meaning || '',
        firstNameData?.meaning || '',
        analysis.lifePath,
        analysis.missingNumbers,
        filledNumbers
      );

      return {
        ...nameData,
        analysis: nameAnalysis,
        // Mark first item as suggested in 'suggested' tab
        isSuggested: filterType === 'suggested' && index === 0,
      };
    });
  }, [analysis, filteredNames, filterType]);

  const handleStart = (data: FormData) => {
    setInputData(data);
    setFilterType('suggested');
  };

  if (!inputData) {
    return (
      <div className="min-h-screen flex flex-col w-full relative">
        <main className="flex-grow flex items-center justify-center px-6 py-10 md:py-20 relative w-full">
          {/* Abstract Decorative Background Elements */}
          <div className="absolute top-20 left-0 md:left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary-fixed opacity-20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-0 md:right-1/4 w-48 md:w-64 h-48 md:h-64 bg-secondary-container opacity-30 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-2xl w-full flex flex-col items-center">
            {/* Header Section */}
            <div className="text-center mb-10 md:mb-12 mt-8 md:mt-0">
              <div className="mb-4 inline-flex items-center justify-center p-3 rounded-full bg-surface-container">
                <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
              </div>
              <h1 className="font-headline text-4xl md:text-6xl font-light tracking-tight text-on-surface mb-6">
                Cố Vấn Đặt Tên
              </h1>
              <p className="text-on-surface-variant font-body text-base md:text-lg max-w-md mx-auto leading-relaxed opacity-80">
                Công cụ gợi ý tên cân bằng thần số học cho bé, được thiết kế tinh xảo dành cho những khởi đầu hoàn mỹ.
              </p>
            </div>

            <AdvisorForm onStart={handleStart} />

            {/* Footer Decor */}
            <div className="mt-16 flex flex-col items-center gap-4 opacity-50">
              <div className="h-px w-24 bg-outline-variant/30"></div>
              <div className="text-[10px] font-label tracking-[0.3em] text-on-surface-variant uppercase">
                Thần Số Học • 2026
              </div>
            </div>
          </div>
        </main>

        {/* Side Decoration */}
        <aside className="hidden lg:flex fixed right-0 top-0 h-full w-24 border-l border-outline-variant/10 flex-col justify-center items-center gap-12 text-on-surface-variant/40">
          <span className="rotate-90 whitespace-nowrap font-label text-[10px] tracking-[0.4em] uppercase">Tinh hoa đặt tên</span>
          <div className="w-px h-32 bg-outline-variant/20"></div>
          <span className="material-symbols-outlined">ink_pen</span>
        </aside>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <nav className="sticky top-0 z-50 w-full px-6 md:px-8 py-6 bg-surface/80 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={() => setInputData(null)}
          className="flex items-center gap-2 group text-primary transition-all duration-300"
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-label text-sm font-semibold tracking-widest uppercase hidden md:inline">Quay lại</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="font-headline italic text-xl text-primary">Cố Vấn Đặt Tên</span>
        </div>
      </nav>

      <main className="max-w-[1440px] w-full mx-auto px-6 md:px-8 pb-24 mt-4 relative z-10 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* LEFT COLUMN (35%) */}
          <aside className="w-full lg:w-[35%] flex flex-col gap-6 lg:gap-8">
            <EnergyGrid mask={currentMask} />

            {/* Core Number Card */}
            <section className="bg-surface-container-low rounded-xl p-10 flex flex-col items-center text-center transition-all hover:bg-surface-container duration-500">
              <h3 className="font-label text-[11px] font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-6">CON SỐ CHỦ ĐẠO</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary-fixed opacity-50"></div>
                <div className="absolute inset-2 rounded-full border border-primary-container opacity-30"></div>
                <span className="font-headline text-6xl text-primary font-bold">{analysis.lifePath}</span>
              </div>
            </section>

            {/* Missing Numbers Card */}
            <section className="bg-surface-container-low rounded-xl p-8 transition-all hover:bg-surface-container duration-500">
              <h3 className="font-label text-[11px] font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-6">Số thiếu theo ngày sinh</h3>

              {analysis.missingNumbers.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {analysis.missingNumbers.map(num => (
                    <span key={num} className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg text-on-surface-variant font-headline font-semibold">
                      {num}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                Ngày sinh của bé đã có sẵn năng lượng từ những con số hiện hữu. Để đạt được sự cân bằng trong vận mệnh và tính cách,
                {analysis.missingNumbers.length > 0 ? (
                  <span> bé cần <span className="text-primary font-semibold">bù các số {analysis.missingNumbers.join(', ')}</span> thông qua việc đặt tên chính xác.</span>
                ) : (
                  <span> bé đã <span className="text-primary font-semibold">hoàn toàn cân bằng</span> dựa trên ngày sinh.</span>
                )}
              </p>
            </section>
          </aside>

          {/* RIGHT COLUMN (65%) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8 lg:gap-10">
            {/* Header & Tabs */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
              <div>
                <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary tracking-tight">GỢI Ý TÊN CÂN BẰNG</h1>
                <p className="text-on-surface-variant mt-2 text-sm">Dựa trên phân tích tần số rung động của họ và ngày sinh.</p>
              </div>

              <div className="flex bg-surface-container-low p-1.5 rounded-full overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setFilterType('suggested')}
                  className={`min-w-fit px-6 py-2 rounded-full text-xs font-bold font-label uppercase tracking-wider transition-colors ${filterType === 'suggested'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                  Gợi ý
                </button>
                <button
                  onClick={() => setFilterType('father')}
                  className={`min-w-fit px-6 py-2 rounded-full text-xs font-bold font-label uppercase tracking-wider transition-colors ${filterType === 'father'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                  Họ Bố
                </button>
                {!analysis.isSameLast && (
                  <button
                    onClick={() => setFilterType('combined')}
                    className={`min-w-fit px-6 py-2 rounded-full text-xs font-bold font-label uppercase tracking-wider transition-colors ${filterType === 'combined'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                      }`}
                  >
                    Ghép họ
                  </button>
                )}
              </div>
            </header>

            {/* Grid of Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {namesWithStorytelling.length === 0 ? (
                <div className="col-span-full p-8 text-center text-on-surface-variant">
                  Không tìm thấy gợi ý tên phù hợp trong danh mục này.
                </div>
              ) : (
                namesWithStorytelling.map((name) => {
                  const nameNumbers: number[] = [];
                  for (let i = 1; i <= 9; i += 1) {
                    if (name.mask & (1 << (i - 1))) {
                      nameNumbers.push(i);
                    }
                  }

                  return (
                    <div key={name.name} className={name.isSuggested ? "md:col-span-2" : ""}>
                      <NameCard
                        name={name.name}
                        numbers={nameNumbers}
                        analysis={name.analysis}
                        isSuggested={name.isSuggested}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Narrative */}
            <div className="mt-8 p-10 md:p-12 bg-secondary-container/20 rounded-2xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">architecture</span>
              <h3 className="font-headline text-2xl font-bold mb-4">Mỗi cái tên là một tác phẩm</h3>
              <p className="max-w-xl text-on-surface-variant font-body leading-relaxed">
                Các gợi ý trên được tinh lọc bởi AI chuyên gia đặt tên, đảm bảo sự hài hòa giữa âm hưởng văn hóa và khoa học số học. Hãy chọn một cái tên mang lại cảm giác bình an nhất cho bạn.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Side Decoration (Digital Atelier Style) */}
      <div className="fixed top-0 right-0 h-full w-2 flex flex-col z-0">
        <div className="h-1/3 bg-primary/10"></div>
        <div className="h-1/3 bg-primary-container/20"></div>
        <div className="h-1/3 bg-tertiary-fixed/30"></div>
      </div>
    </div>
  );
}