import React, { useRef } from 'react';
import { Upload, Copy, Download, Trash2, FileText, Check } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-blue-400" />
          <span className="font-medium text-sm text-slate-300">{label}</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            .{extension}
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
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Upload File"
              >
                <Upload size={16} />
              </button>
              <button 
                 onClick={() => onChange && onChange('')}
                 className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
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
                className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                title="Copy"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button 
                onClick={handleDownload}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 relative group">
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full h-full p-4 bg-transparent text-sm font-mono leading-relaxed resize-none focus:outline-none 
            ${readOnly ? 'text-slate-300' : 'text-slate-200'}
            placeholder-slate-600
          `}
          spellCheck={false}
        />
        {readOnly && !value && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 pointer-events-none">
            <span className="text-sm">Output will appear here...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;