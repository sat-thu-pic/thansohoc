import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-advisor-50 to-white text-advisor-900">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8 text-center">
        <div className="bg-advisor-100 p-4 rounded-full text-advisor-600">
          <Sparkles size={48} />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-advisor-900 sm:text-7xl">
          Naming Advisor
        </h1>
        <p className="mt-6 text-xl leading-8 text-advisor-700 max-w-2xl">
          Hệ thống cố vấn đặt tên chuyên sâu, giúp cha mẹ tìm thấy cái tên cân bằng năng lượng tuyệt đối cho bé yêu dựa trên Thần số học Pytago.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="rounded-md bg-advisor-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-advisor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-advisor-600 transition-all">
            Bắt đầu tư vấn
          </button>
        </div>
      </div>
    </main>
  );
}
