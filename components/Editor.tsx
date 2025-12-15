import React, { useRef, useState } from 'react';
import { Upload, Copy, Download, Trash2, FileCode, Check, FileJson, FileType, FileText, FileSpreadsheet, Braces, ScrollText, Sigma, Globe } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  label: string;
  placeholder?: string;
  extension?: string;
  onFileUpload?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  readOnly, 
  label, 
  placeholder,
  extension = 'txt',
  onFileUpload
}) => {
  const [copied, setCopied] = React.useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  };

  const getIcon = () => {
    switch (extension) {
      case 'json': return <FileJson size={18} className="text-amber-400" />;
      case 'csv': return <FileSpreadsheet size={18} className="text-emerald-400" />;
      case 'xml': return <FileCode size={18} className="text-orange-400" />;
      case 'yaml': return <ScrollText size={18} className="text-indigo-400" />;
      case 'md': return <FileType size={18} className="text-sky-400" />;
      case 'html': return <Globe size={18} className="text-orange-500" />;
      case 'tex': return <Sigma size={18} className="text-teal-400" />;
      default: return <FileText size={18} className="text-slate-400" />;
    }
  };

  return (
    <div 
      className={`flex flex-col h-full bg-slate-900/80 rounded-2xl border backdrop-blur-sm shadow-xl transition-all duration-300 overflow-hidden
        ${isFocused 
          ? 'border-blue-500/50 shadow-blue-500/10 ring-1 ring-blue-500/20' 
          : 'border-slate-800 shadow-black/20 hover:border-slate-700'
        }
      `}
    >
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors
         ${isFocused ? 'bg-slate-900 border-blue-500/20' : 'bg-slate-900/50 border-slate-800'}
      `}>
        <div className="flex items-center gap-2.5">
          {getIcon()}
          <span className="font-semibold text-sm text-slate-200 tracking-wide">{label}</span>
          <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
            {extension.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!readOnly && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Upload File"
              >
                <Upload size={16} />
              </button>
              <button 
                 onClick={() => onChange && onChange('')}
                 className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                 title="Clear"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          {readOnly && value && (
            <>
              <button 
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
                title="Copy"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button 
                onClick={handleDownload}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 relative group bg-slate-950/30">
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full h-full p-4 md:p-5 bg-transparent text-sm font-['JetBrains_Mono'] leading-relaxed resize-none focus:outline-none 
            ${readOnly ? 'text-slate-400' : 'text-slate-200'}
            placeholder-slate-700
          `}
          spellCheck={false}
        />
        {readOnly && !value && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-700 pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <FileCode size={32} className="opacity-20" />
              <span className="text-sm font-medium opacity-50">Waiting for conversion...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;