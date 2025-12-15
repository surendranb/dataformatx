import React, { useState, useEffect } from 'react';
import { X, Save, Key, Globe, Cpu } from 'lucide-react';
import { LLMConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LLMConfig;
  onSave: (config: LLMConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<LLMConfig>(config);

  // Reset local state when modal opens/config changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu size={20} className="text-blue-400" />
            LLM Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          
          {/* Provider Select */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLocalConfig({ ...localConfig, provider: 'gemini', model: 'gemini-2.5-flash', baseUrl: '' })}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  localConfig.provider === 'gemini' 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Google Gemini
              </button>
              <button
                onClick={() => setLocalConfig({ ...localConfig, provider: 'openai', model: '', baseUrl: '' })}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  localConfig.provider === 'openai' 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                OpenAI / Local
              </button>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="flex flex-col gap-4">
            
            {/* Base URL (OpenAI only) */}
            {localConfig.provider === 'openai' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Globe size={12} /> Base URL
                </label>
                <input
                  type="text"
                  value={localConfig.baseUrl}
                  onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
                  placeholder="http://localhost:1234/v1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:border-blue-500 focus:outline-none placeholder-slate-600"
                />
                <p className="text-[10px] text-slate-500">
                  Tip: For LM Studio or Ollama, try <code>http://localhost:1234/v1</code>
                </p>
              </div>
            )}

            {/* Model Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Model Name</label>
              <input
                type="text"
                value={localConfig.model}
                onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
                placeholder={localConfig.provider === 'gemini' ? "gemini-2.5-flash" : "gpt-4o, llama3..."}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:border-blue-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            {/* API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Key size={12} /> API Key
              </label>
              <input
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:border-blue-500 focus:outline-none placeholder-slate-600"
              />
              <p className="text-[10px] text-slate-500">
                Keys are stored locally. Leave empty for local LLMs if not required.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;