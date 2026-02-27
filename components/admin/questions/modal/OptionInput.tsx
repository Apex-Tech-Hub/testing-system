export const OptionInput = ({ index, value, isChecked, onTextChange, onRadioChange }: any) => {
  const label = String.fromCharCode(65 + index);
  return (
    <div className="space-y-2">
      <div className=" flex justify-between items-center px-1">
        <label className="text-[10px]  font-black text-slate-400 uppercase tracking-widest">
          Option {label}
        </label>
        <input 
          type="radio" 
          name="correct" 
          checked={isChecked}
          onChange={onRadioChange}
          className="w-4 h-4 accent-emerald-500 cursor-pointer"
        />
      </div>
      <input 
        type="text"
        className={`w-full text-black bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold outline-none ring-2 transition-all ${
          isChecked ? 'ring-emerald-500 bg-emerald-50/30' : 'ring-transparent focus:ring-slate-200'
        }`}
        value={value}
        placeholder={`Type option ${label}...`}
        onChange={(e) => onTextChange(index, e.target.value)}
      />
    </div>
  );
};