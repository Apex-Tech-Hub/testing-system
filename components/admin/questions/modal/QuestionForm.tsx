'use client';

import { useState } from 'react';
import { Save, Trash2, Loader2 } from 'lucide-react';
import { FormHeader } from './FormHeader';
import { OptionInput } from './OptionInput';

interface QuestionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuestionForm({ onSuccess, onCancel }: QuestionFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [question, setQuestion] = useState({
    text: '',
    category: 'English',
    difficulty: 'Medium',
    options: ['', '', '', ''],
    correctAnswerIndex: 0
  });

  // NEW: Validation Logic
  // Returns true only if text exists and every option has content
  const isFormValid = 
    question.text.trim().length > 0 && 
    question.options.every(opt => opt.trim().length > 0);

  const handleOptionChange = (idx: number, val: string) => {
    const newOptions = [...question.options];
    newOptions[idx] = val;
    setQuestion({ ...question, options: newOptions });
  };

  const handleSave = async () => {
    if (!isFormValid) return; // Guard clause

    setIsSaving(true);
    const payload = {
      Text: question.text,
      Category: question.category,
      Difficulty: question.difficulty,
      CorrectOption: String.fromCharCode(65 + question.correctAnswerIndex), 
      OptionA: question.options[0],
      OptionB: question.options[1],
      OptionC: question.options[2],
      OptionD: question.options[3]
    };

    try {
      const response = await fetch('http://localhost:5064/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) onSuccess();
      else alert("Failed to save to database.");
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl">
      <FormHeader 
        category={question.category} 
        difficulty={question.difficulty} 
        setQuestion={setQuestion} 
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Question Content {!question.text && <span className="text-rose-500">*</span>}
          </label>
          <textarea 
            className="w-full bg-slate-50 border-none rounded-[1.5rem] p-6 text-slate-900 font-bold placeholder:text-slate-300 outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all min-h-[120px]"
            placeholder="e.g., What is the primary function of the CPU?"
            value={question.text}
            onChange={(e) => setQuestion({...question, text: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, i) => (
            <OptionInput 
              key={i}
              index={i}
              value={opt}
              isChecked={question.correctAnswerIndex === i}
              onTextChange={handleOptionChange}
              onRadioChange={() => setQuestion({...question, correctAnswerIndex: i})}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex gap-4 border-t border-slate-50">
          <button 
            onClick={handleSave}
            // UPDATED: Button is disabled if form is invalid OR currently saving
            disabled={!isFormValid || isSaving}
            className={`flex-1 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl 
              ${isFormValid && !isSaving 
                ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-200' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            SAVE TO BANK
          </button>
          
          <button 
            onClick={onCancel}
            className="px-8 bg-slate-50 text-slate-400 font-black py-4 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}