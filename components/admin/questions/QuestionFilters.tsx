import { Search } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const QuestionFilters = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }: Props) => (
  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto w-full lg:w-fit">
      {['All', 'English', 'Computer', 'Science', 'General Knowledge'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
    <div className="relative w-full lg:w-96">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-white border text-black border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  </div>
);