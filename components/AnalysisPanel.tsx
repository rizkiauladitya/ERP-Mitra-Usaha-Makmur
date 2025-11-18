
import React, { useState } from 'react';
import { SparklesIcon } from './IconComponents';
import Loader from './Loader';
import { useTranslation } from '../services/i18n';

interface AnalysisPanelProps {
  onAnalyze: (prompt: string) => void;
  isLoading: boolean;
  result: string | null;
  onClear: () => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ onAnalyze, isLoading, result, onClear }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<string>('');
  
  const popularPrompts = [
    "Provide a brief summary",
    "What are the main trends?",
    "Identify anomalies",
    "Provide suggestions",
  ];

  const handlePromptClick = (p: string) => {
    const fullPromptMap: Record<string, string> = {
        "Provide a brief summary": "Berikan ringkasan singkat dari data ini.",
        "What are the main trends?": "Apa tren utama yang bisa kamu identifikasi?",
        "Identify anomalies": "Identifikasi anomali atau outlier dalam data.",
        "Provide suggestions": "Saran apa yang bisa diberikan berdasarkan data ini?",
    };
    const fullPrompt = fullPromptMap[p] || p;
    setPrompt(fullPrompt);
    onAnalyze(fullPrompt);
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
        {t('AI Analysis Panel')}
      </h3>

      <div className="mb-4">
        <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('Ask a question about your data:')}
        </label>
        <textarea
          id="ai-prompt"
          rows={3}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('Example: What were the total sales last month?')}
        />
      </div>
      <div className="mb-4">
         <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('Or try one of these:')}</p>
         <div className="flex gap-2 flex-wrap">
            {popularPrompts.map(p => (
                <button 
                    key={p} 
                    onClick={() => handlePromptClick(p)} 
                    className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                >
                    {t(p)}
                </button>
            ))}
        </div>
      </div>
       <button
          onClick={() => onAnalyze(prompt)}
          disabled={isLoading || !prompt}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? t('Analyze...') : t('Get Insights')}
          <SparklesIcon className="w-4 h-4 ml-2" />
        </button>

      {(isLoading || result) && (
        <div className="mt-6 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-2">
             <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">{t('Analysis Result:')}</h4>
            {result && !isLoading && (
                <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium">
                {t('Clear')}
                </button>
            )}
          </div>
          <div className="flex-grow p-4 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader message={t('AI is thinking...')} />
                </div>
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">{result}</p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
