import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isLoading: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, content, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Content Card */}
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg p-8 shadow-2xl animate-fade-in flex flex-col items-center text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <Sparkles className={`text-yellow-500 w-8 h-8 ${isLoading ? 'animate-pulse' : ''}`} />
        </div>

        <h2 className="text-3xl font-serif text-white mb-6 tracking-wide">{title}</h2>

        <div className="text-zinc-300 font-sans leading-relaxed text-lg min-h-[100px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <p className="animate-fade-in">{content}</p>
          )}
        </div>

        {!isLoading && (
          <button 
            onClick={onClose}
            className="mt-8 px-6 py-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white transition-all duration-300 text-sm tracking-widest uppercase"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoModal;