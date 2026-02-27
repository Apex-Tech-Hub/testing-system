import { Zap, Loader2, Edit3, Trash2, SearchX } from 'lucide-react';

const difficultyStyles: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Medium: "bg-amber-50 text-amber-600 border-amber-100",
  Hard: "bg-rose-50 text-rose-600 border-rose-100",
};

interface QuestionTableProps {
  questions: any[];
  isLoading: boolean;
  onEdit: (question: any) => void;
  onDelete: (id: number) => void;
}

export const QuestionTable = ({ questions, isLoading, onEdit, onDelete }: QuestionTableProps) => {
  // Determine if we should show the "No Questions" state
  const hasNoData = !isLoading && questions.length === 0;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12 text-center">#</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Question Detail</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Level</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Correct</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {isLoading ? (
            /* Loading State */
            <tr>
              <td colSpan={6} className="p-20 text-center text-emerald-500">
                <Loader2 size={40} className="animate-spin mx-auto mb-2" />
                <p className="font-black text-xs uppercase tracking-widest text-slate-400">Syncing Bank...</p>
              </td>
            </tr>
          ) : hasNoData ? (
            /* Empty State */
            <tr>
              <td colSpan={6} className="p-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="bg-slate-50 p-6 rounded-full">
                    <SearchX size={48} className="text-slate-200" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-black text-lg">No Questions Found</p>
                    <p className="text-slate-400 font-medium italic text-sm">Try adjusting your filters or add a new question to the bank.</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            /* Data State */
            questions.map((q: any) => (
              <tr key={q.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="p-6 text-center text-xs font-black text-slate-300">{q.id}</td>
                <td className="p-6 max-w-md font-bold text-slate-900 leading-relaxed">{q.text}</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-100">
                    {q.category}
                  </span>
                </td>
                <td className="p-6">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1 w-fit ${difficultyStyles[q.difficulty] || difficultyStyles['Medium']}`}>
                    <Zap size={10} fill="currentColor" /> {q.difficulty}
                  </span>
                </td>
                <td className="p-6 font-bold text-emerald-600">
                  <span className="text-[10px] text-slate-300 mr-1">{q.correct}</span> {q.correctText}
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button 
                      onClick={() => onEdit(q)}
                      className="p-2.5 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-100 transition-all shadow-sm"
                      title="Edit Question"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(q.id)}
                      className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 transition-all shadow-sm"
                      title="Delete Question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};