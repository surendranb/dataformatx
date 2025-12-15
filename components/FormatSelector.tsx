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
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
        {label}
      </label>
      <div className="relative group">
        <select
          value={selected.value}
          onChange={(e) => {
            const format = SUPPORTED_FORMATS.find(f => f.value === e.target.value);
            if (format) onChange(format);
          }}
          disabled={disabled}
          className="w-full appearance-none bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors text-slate-100 py-3 pl-4 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <optgroup label="Code Formats">
            {SUPPORTED_FORMATS.filter(f => f.category === 'Code').map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </optgroup>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-hover:text-blue-400">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;