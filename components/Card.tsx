import React from 'react';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  onClick: (data: CardData) => void;
  onHover: (data: CardData | null) => void;
  index: number;
}

const Card: React.FC<CardProps> = ({ data, onClick, onHover, index }) => {
  const cardDelay = index * 120; 
  const titleDelay = cardDelay + 400;

  return (
    <div 
      className="group relative cursor-pointer animate-slide-up opacity-0 flex flex-col items-center"
      style={{ animationDelay: `${cardDelay}ms` }}
      onClick={() => onClick(data)}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Visual Component (The Rectangle) */}
      <div className="h-[440px] w-[280px] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out group-hover:-translate-y-6 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/5 rounded-[4px] bg-zinc-900">
        
        {data.type === 'solid' ? (
          <div 
            className="w-full h-full transition-transform duration-1000 group-hover:scale-110" 
            style={{ backgroundColor: data.color || '#ffffff' }}
          />
        ) : (
          <img 
            src={data.src} 
            alt={data.title}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-125 opacity-80 group-hover:opacity-100 grayscale-[0.2] group-hover:grayscale-0"
          />
        )}
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all duration-700 pointer-events-none" />
        
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] group-hover:shadow-[inset_0_0_60px_rgba(255,255,255,0.05)] transition-all duration-700" />
      </div>

      {/* Label Component (Centered Bottom Wording) */}
      <div className="mt-8 px-2 max-w-[260px] flex flex-col items-center transition-all duration-700 group-hover:translate-y-[-8px]">
           <h3 
             className="text-white font-serif text-[13px] tracking-[0.25em] uppercase text-center leading-relaxed opacity-60 group-hover:opacity-100 transition-all duration-500 animate-fade-in"
             style={{ 
               animationDelay: `${titleDelay}ms`,
               textShadow: '0 2px 10px rgba(0,0,0,0.5)'
             }}
           >
             {data.title}
           </h3>
           <div className="h-[2px] w-0 group-hover:w-8 bg-white/40 mt-3 transition-all duration-500 ease-in-out" />
      </div>

      {/* Interactive Trigger Glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/0 blur-xl group-hover:bg-white/20 transition-all duration-700" />
    </div>
  );
};

export default Card;