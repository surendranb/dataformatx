import React from 'react';
import { ConversionOption } from '../types';
import { SUPPORTED_FORMATS } from '../constants';
import { ChevronDown } from 'lucide-react';

interface FormatSelectorProps {
  label: string;
  selected: ConversionOption;
  onChange: (format: ConversionOption) => void;
  disabled?: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ label, selected, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 group-hover:text-slate-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <select
          value={selected.value}
          onChange={(e) => {
            const format = SUPPORTED_FORMATS.find(f => f.value === e.target.value);
            if (format) onChange(format);
          }}
          disabled={disabled}
          className="w-full appearance-none bg-slate-950/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-900 transition-all text-slate-200 py-3.5 pl-4 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          <optgroup label="Data Formats">
            {SUPPORTED_FORMATS.filter(f => f.category === 'Data').map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </optgroup>
          <optgroup label="Document Formats">
            {SUPPORTED_FORMATS.filter(f => f.category === 'Document').map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </optgroup>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;