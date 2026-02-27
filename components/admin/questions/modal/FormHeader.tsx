import { Sparkles } from 'lucide-react';

export const FormHeader = ({ category, difficulty, setQuestion }: any) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        Create New Question
      </h3>
      <p className="text-slate-500 font-medium italic">Define the logic for your upcoming assessment</p>
    </div>
    <div className="flex gap-3">
      <select 
        className="bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-slate-600 outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all cursor-pointer"
        value={difficulty}
        onChange={(e) => setQuestion((prev: any) => ({...prev, difficulty: e.target.value}))}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <select 
        className="bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-slate-600 outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all cursor-pointer"
        value={category}
        onChange={(e) => setQuestion((prev: any) => ({...prev, category: e.target.value}))}
      >
        <option>English</option>
        <option>Science</option>
        <option>Computer</option>
        <option>General Knowledge</option>
      </select>
    </div>
  </div>
);