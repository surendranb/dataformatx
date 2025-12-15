import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Sparkles, AlertTriangle, RotateCw, Settings, Boxes, CircleHelp } from 'lucide-react';
import { SUPPORTED_FORMATS, SAMPLE_DATA, MAX_INPUT_CHARS, DEFAULT_LLM_CONFIG } from './constants';
import { FormatType, LLMConfig } from './types';
import { convertContent } from './services/llmService';
import FormatSelector from './components/FormatSelector';
import Editor from './components/Editor';
import SettingsModal from './components/SettingsModal';
import FAQModal from './components/FAQModal';

const App: React.FC = () => {
  const [fromFormat, setFromFormat] = useState(SUPPORTED_FORMATS[0]); // JSON
  const [toFormat, setToFormat] = useState(SUPPORTED_FORMATS[1]);   // CSV
  
  const [inputContent, setInputContent] = useState(SAMPLE_DATA[FormatType.JSON]);
  const [outputContent, setOutputContent] = useState('');
  
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings & Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(DEFAULT_LLM_CONFIG);
  const [hasConfigured, setHasConfigured] = useState(false);

  // Load Config on Mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dataformatx_llm_config');
    if (savedConfig) {
      try {
        setLlmConfig(JSON.parse(savedConfig));
        setHasConfigured(true);
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    } else {
      // If no config, prompt user to set it up
      setIsSettingsOpen(true);
    }
  }, []);

  const handleSaveConfig = (newConfig: LLMConfig) => {
    setLlmConfig(newConfig);
    localStorage.setItem('dataformatx_llm_config', JSON.stringify(newConfig));
    setHasConfigured(true);
  };

  // Check if current content matches any known sample
  const isSampleContent = (text: string) => Object.values(SAMPLE_DATA).includes(text);

  // Auto-fill sample data for INPUT when changing source format
  useEffect(() => {
    // If input is empty or is currently a sample, update it to the new format's sample
    if (!inputContent || isSampleContent(inputContent)) {
      const newFromSample = SAMPLE_DATA[fromFormat.value as keyof typeof SAMPLE_DATA];
      setInputContent(newFromSample);
      
      // Also update output to the target sample to preview the format
      // This creates an immediate "preview" effect without calling LLM
      const newToSample = SAMPLE_DATA[toFormat.value as keyof typeof SAMPLE_DATA];
      setOutputContent(newToSample);
      
      setError(null);
    }
    // Note: If input is custom, we do NOT clear output here. 
    // This allows swaps to preserve the converted result in the input field without wiping the new output.
  }, [fromFormat]);

  // Auto-fill sample data for OUTPUT when changing target format
  useEffect(() => {
    // Only if we are in "Sample Mode" (input is a sample)
    if (!inputContent || isSampleContent(inputContent)) {
      const newToSample = SAMPLE_DATA[toFormat.value as keyof typeof SAMPLE_DATA];
      setOutputContent(newToSample);
    }
    // If input is custom, we leave output as is (it might be a valid previous conversion or empty)
  }, [toFormat]);

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

    if (!llmConfig.apiKey && llmConfig.provider === 'gemini') {
        setIsSettingsOpen(true);
        setError("Please configure your API Key in Settings.");
        return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const result = await convertContent(inputContent, fromFormat.value, toFormat.value, llmConfig);
      
      if (result.startsWith('ERROR:')) {
        setError(result);
      } else {
        setOutputContent(result);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please check your connection and settings.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-950 pointer-events-none" />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={llmConfig}
        onSave={handleSaveConfig}
      />

      <FAQModal 
        isOpen={isFAQOpen} 
        onClose={() => setIsFAQOpen(false)}
      />

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
                <Boxes className="text-white h-5 w-5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                DataFormatX
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 shadow-inner">
                <span className={`w-1.5 h-1.5 rounded-full ${hasConfigured ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></span>
                {llmConfig.provider === 'gemini' ? 'Gemini' : 'OpenAI/Local'} 
                <span className="text-slate-600">|</span>
                <span className="truncate max-w-[100px]">{llmConfig.model}</span>
             </div>
             
             <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsFAQOpen(true)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                  title="FAQs"
                >
                  <CircleHelp size={20} />
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center relative z-10">
        <div className="w-full max-w-7xl flex-1 flex flex-col gap-6">
          
          {/* Controls Bar Container */}
          <div className="bg-slate-900/60 p-5 md:p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex flex-col gap-5">
            
            {/* Top Row: Selectors and Swap */}
            <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 w-full">
              <div className="flex-1 w-full md:w-auto">
                <FormatSelector 
                  label="Source" 
                  selected={fromFormat} 
                  onChange={setFromFormat} 
                  disabled={isConverting}
                />
              </div>
              
              <button 
                onClick={handleSwap}
                className="p-3.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl border border-transparent hover:border-blue-500/20 transition-all active:scale-95 md:mb-[1px]"
                title="Swap Formats"
                disabled={isConverting}
              >
                <RotateCw size={20} />
              </button>

              <div className="flex-1 w-full md:w-auto">
                <FormatSelector 
                  label="Target" 
                  selected={toFormat} 
                  onChange={setToFormat} 
                  disabled={isConverting}
                />
              </div>
            </div>

            {/* Bottom Row: Convert Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={handleConvert}
                disabled={isConverting || !inputContent.trim()}
                className={`
                  w-full md:w-auto md:min-w-[240px] px-8 py-4 rounded-xl font-bold text-white shadow-lg
                  flex items-center justify-center gap-2.5 relative overflow-hidden
                  transition-all duration-300 transform text-lg tracking-wide
                  ${isConverting || !inputContent.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-[length:200%_100%] hover:bg-[100%_0] border border-blue-400/20 hover:shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                {isConverting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <span>Let's Convert</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle size={18} className="text-red-400" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Editors Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-[600px]">
            <Editor 
              label="Input" 
              value={inputContent} 
              onChange={setInputContent} 
              placeholder="Paste your content here..."
              extension={fromFormat.extension}
              onFileUpload={setInputContent}
            />

            <div className="relative">
              {/* Arrow Indicator */}
              <div className="absolute top-1/2 -left-3 md:-left-5 transform -translate-y-1/2 z-20 hidden md:block">
                <div className="bg-slate-900 text-slate-500 p-1.5 rounded-full border border-slate-800 shadow-xl">
                  <ArrowRight size={14} />
                </div>
              </div>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
                <div className="bg-slate-900 text-slate-500 p-1.5 rounded-full border border-slate-800 shadow-xl">
                  <ArrowDown size={14} />
                </div>
              </div>
              
              <Editor 
                label="Output" 
                value={outputContent} 
                readOnly={true} 
                placeholder="The converted result will appear here..."
                extension={toFormat.extension}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-center gap-6 pb-6 pt-2">
             <a 
               href="https://surendranb.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-slate-600 hover:text-slate-400 transition-colors text-xs font-medium tracking-wide"
             >
               Built by Surendran
             </a>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;