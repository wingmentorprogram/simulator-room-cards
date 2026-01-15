import React from 'react';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  onClick: (data: CardData) => void;
  onHover: (data: CardData | null) => void;
  index: number;
}

const Card: React.FC<CardProps> = ({ data, onClick, onHover, index }) => {
  // Staggered animation delay based on index.
  const cardDelay = index * 150; 
  // Title appears shortly after card
  const titleDelay = cardDelay + 300;

  return (
    <div 
      className="group relative cursor-pointer animate-slide-up opacity-0 flex flex-col items-center"
      style={{ animationDelay: `${cardDelay}ms` }}
      onClick={() => onClick(data)}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Visual Rectangle (Image/Solid) */}
      <div className="h-[420px] w-[280px] relative overflow-hidden shadow-2xl transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] border border-white/10 rounded-sm bg-zinc-900">
        
        {data.type === 'solid' ? (
          <div 
            className="w-full h-full transition-transform duration-700 group-hover:scale-105" 
            style={{ backgroundColor: data.color || '#ffffff' }}
          />
        ) : (
          <img 
            src={data.src} 
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110 opacity-90 group-hover:opacity-100"
          />
        )}
        
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Text Strip - Below the Rectangle */}
      <div className="mt-6 max-w-[280px] transition-all duration-500 group-hover:translate-y-[-4px]">
           <h3 
             className="text-zinc-300 group-hover:text-white text-xs font-serif tracking-[0.2em] uppercase text-center leading-relaxed drop-shadow-md animate-fade-in opacity-0 transition-colors duration-300"
             style={{ animationDelay: `${titleDelay}ms` }}
           >
             {data.title}
           </h3>
      </div>
    </div>
  );
};

export default Card;