import React from 'react';
import { X, HelpCircle, ShieldCheck, Zap, Database, Lock, Key } from 'lucide-react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      question: "Is my data private?",
      answer: "Absolutely. DataFormatX follows a Local-First architecture. All file parsing happens in your browser. If you use Local LLMs, data never leaves your device. If you use Gemini/OpenAI, data is sent strictly to them for conversion.",
      icon: <Lock size={18} className="text-emerald-400" />
    },
    {
      question: "Do I need an API Key?",
      answer: "It depends. For cloud providers like Google Gemini or OpenAI, yes. However, you can use local models (like Ollama or LM Studio) completely free without an API key.",
      icon: <Key size={18} className="text-amber-400" />
    },
    {
      question: "How do I use Local LLMs?",
      answer: "Go to Settings, select 'OpenAI / Local', and set the Base URL to your local server (e.g., http://localhost:11434/v1 for Ollama). Leave the API key empty.",
      icon: <Database size={18} className="text-blue-400" />
    },
    {
      question: "Is this tool free?",
      answer: "The tool itself is open-source and free to use. Costs associated with API usage (Gemini/OpenAI) depend on your personal subscription with those providers.",
      icon: <Zap size={18} className="text-purple-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle size={20} className="text-blue-400" />
            Frequently Asked Questions
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div className="flex gap-4">
                  <div className="mt-1 bg-slate-900 p-2 rounded-lg h-fit border border-slate-800">
                    {faq.icon}
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-semibold mb-1.5">{faq.question}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-blue-200 font-medium text-sm mb-1">Security Note</h4>
              <p className="text-blue-300/80 text-xs">
                We do not store, log, or cache any of your files or API keys on our servers. 
                Everything resides in your browser's local storage.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQModal;