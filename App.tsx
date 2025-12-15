import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Sparkles, AlertTriangle, RotateCw } from 'lucide-react';
import { SUPPORTED_FORMATS, SAMPLE_DATA, MAX_INPUT_CHARS } from './constants';
import { FormatType } from './types';
import { convertContent } from './services/geminiService';
import FormatSelector from './components/FormatSelector';
import Editor from './components/Editor';

const App: React.FC = () => {
  const [fromFormat, setFromFormat] = useState(SUPPORTED_FORMATS[0]); // JSON
  const [toFormat, setToFormat] = useState(SUPPORTED_FORMATS[1]);   // CSV
  
  const [inputContent, setInputContent] = useState(SAMPLE_DATA[FormatType.JSON]);
  const [outputContent, setOutputContent] = useState('');
  
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill sample data when changing source format if input is empty or matches previous sample
  useEffect(() => {
    const previousSample = Object.values(SAMPLE_DATA).includes(inputContent);
    if ((!inputContent || previousSample) && SAMPLE_DATA[fromFormat.value as keyof typeof SAMPLE_DATA]) {
      setInputContent(SAMPLE_DATA[fromFormat.value as keyof typeof SAMPLE_DATA]);
    }
    // Clear output when format changes to avoid confusion
    setOutputContent(''); 
    setError(null);
  }, [fromFormat]);

  const handleSwap = () => {
    const temp = fromFormat;
    setFromFormat(toFormat);
    setToFormat(temp);
    setInputContent(outputContent);
    setOutputContent(inputContent);
  };

  const handleConvert = async () => {
    if (!inputContent.trim()) return;
    
    if (inputContent.length > MAX_INPUT_CHARS) {
      setError(`Input too large. Limit is ${MAX_INPUT_CHARS.toLocaleString()} characters.`);
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const result = await convertContent(inputContent, fromFormat.value, toFormat.value);
      if (result.startsWith('ERROR:')) {
        setError(result);
      } else {
        setOutputContent(result);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 flex flex-col">
      
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                PolyGlot AI
              </h1>
              <p className="text-xs text-slate-500">Universal File Converter</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
             <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                Powered by Gemini 2.5 Flash
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-7xl flex-1 flex flex-col gap-6">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-white/5 shadow-xl backdrop-blur-sm">
            <FormatSelector 
              label="Convert From" 
              selected={fromFormat} 
              onChange={setFromFormat} 
              disabled={isConverting}
            />
            
            <button 
              onClick={handleSwap}
              className="p-3 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all active:scale-95 mb-[1px]"
              title="Swap Formats"
              disabled={isConverting}
            >
              <RotateCw size={20} />
            </button>

            <FormatSelector 
              label="Convert To" 
              selected={toFormat} 
              onChange={setToFormat} 
              disabled={isConverting}
            />

            <button
              onClick={handleConvert}
              disabled={isConverting || !inputContent.trim()}
              className={`
                w-full md:w-auto px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-blue-900/20
                flex items-center justify-center gap-2 mb-[1px] min-w-[160px]
                transition-all duration-300
                ${isConverting || !inputContent.trim()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
            >
              {isConverting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Convert</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertTriangle size={18} className="text-red-400" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Editors Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 min-h-[500px]">
            <Editor 
              label="Input" 
              value={inputContent} 
              onChange={setInputContent} 
              placeholder="Paste content here or upload a file..."
              extension={fromFormat.extension}
              onFileUpload={setInputContent}
            />

            <div className="relative">
              <div className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 z-10 hidden md:block">
                <div className="bg-slate-800 text-slate-500 p-2 rounded-full border border-slate-700">
                  <ArrowRight size={16} />
                </div>
              </div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 md:hidden">
                <div className="bg-slate-800 text-slate-500 p-2 rounded-full border border-slate-700">
                  <ArrowDown size={16} />
                </div>
              </div>
              
              <Editor 
                label="Output" 
                value={outputContent} 
                readOnly={true} 
                placeholder="Result will appear here..."
                extension={toFormat.extension}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center pb-6">
            <p className="text-xs text-slate-600">
              PolyGlot AI processes data privately. Large files are truncated. 
              Always verify converted code before production use.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;