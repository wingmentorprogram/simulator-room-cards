import React, { useState } from 'react';
import Card from './components/Card';
import InfoModal from './components/InfoModal';
import SmokeBackground from './components/SmokeBackground';
import { CardData } from './types';
import { generateCreativeDescription } from './services/geminiService';

// Aviation themed data
const CARDS: CardData[] = [
  {
    id: '1',
    title: 'IFR Procedures & Charts',
    type: 'image',
    // Reliable cockpit image
    src: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?q=80&w=800&auto=format&fit=crop',
    promptContext: 'cockpit flight instruments, IFR charts, navigation, aviation precision, night flight',
    description: 'Mastering the unseen paths of the sky. Precision navigation through clouds and darkness using advanced instrumentation.',
  },
  {
    id: '2',
    title: 'Check Ride Interview Preparation',
    type: 'image',
    // Professional aviator image
    src: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800', 
    promptContext: 'pilot pre-flight inspection, aviation interview, confident aviator, airline pilot uniform, professionalism',
    description: 'The culmination of training and discipline. Preparing to demonstrate the knowledge, skill, and poise of a professional aviator.',
  },
  {
    id: '3',
    title: 'VFR and Cross Country XC Planning Simulation',
    type: 'image',
    // Updated to a reliable scenic aerial view (Mountains)
    src: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop',
    promptContext: 'aerial view of mountains, clear blue sky, visual flight rules, freedom of flight, scenic landscape',
    description: 'The pure freedom of visual flight. Soaring over breathtaking landscapes with the horizon as your primary guide.',
  },
  {
    id: '4',
    title: 'EBT Workload Management Simulator',
    type: 'image',
    // Complex cockpit/simulator
    src: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
    promptContext: 'flight simulator cockpit, crew resource management, high workload aviation, complex scenario, pilot teamwork',
    description: 'Advanced scenario-based training. Enhancing resilience and decision-making through complex, evidence-based simulation.',
  },
];

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [hoveredCard, setHoveredCard] = useState<CardData | null>(null);
  const [aiContent, setAiContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCardClick = async (card: CardData) => {
    setSelectedCard(card);
    setModalOpen(true);
    setLoading(true);
    setAiContent(''); // Reset content

    const description = await generateCreativeDescription(card.promptContext);
    setAiContent(description);
    setLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    // slight delay to clear state after animation
    setTimeout(() => setSelectedCard(null), 300);
  };

  // Calculate rotation for 3D effect
  const getTransformStyle = (index: number) => {
    const total = CARDS.length;
    const mid = (total - 1) / 2;
    const offset = index - mid;
    
    // Inward Curve (Concave Screen Effect)
    // Rotation: 
    // Left items (negative offset) rotate positive (clockwise) to face center
    // Right items (positive offset) rotate negative (counter-clockwise) to face center
    const rotateY = offset * -10; 
    
    // Z-Depth: 
    // In a concave screen, the edges are closer to the viewer (positive Z) than the center.
    const translateZ = Math.abs(offset) * 40; 
    
    // X-Translation: 
    // Spread them out horizontally relative to center
    const translateX = offset * 320;

    return {
      transform: `perspective(1000px) translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg)`,
      zIndex: Math.floor(Math.abs(offset)),
    };
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center overflow-hidden relative">
      
      {/* Smoke Shader Background */}
      <SmokeBackground />

      {/* Header - relative layout ensures it pushes the main content down and isn't obscured */}
      <header className="relative z-30 pt-8 pb-4 w-full text-center shrink-0">
        <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          The Simulator Room
        </h1>
        <p className="mt-2 text-zinc-400 text-sm tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          WingMentor Simulator Modules
        </p>
      </header>

      {/* Main Display Area - Flex 1 fills the remaining vertical space */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center perspective-[2000px]">
        {CARDS.map((card, index) => (
          <div 
            key={card.id}
            // Absolute positioning centers all cards within the main container
            className="absolute transition-all duration-700 ease-out preserve-3d top-1/2 left-1/2 -ml-[140px] -mt-[210px]" 
            style={getTransformStyle(index)}
          >
            <Card 
              data={card} 
              index={index} 
              onClick={handleCardClick}
              onHover={setHoveredCard}
            />
          </div>
        ))}
      </main>

      {/* Description Area - Fixed height footer */}
      <footer className="relative z-20 h-[25vh] w-full shrink-0 pointer-events-none flex flex-col justify-start items-center pt-4 md:pt-8 transition-all duration-500">
        {hoveredCard ? (
          <div className="animate-slide-up flex flex-col items-center text-center px-4 max-w-2xl">
            <h2 className="text-3xl font-serif tracking-[0.2em] uppercase font-medium text-white drop-shadow-lg mb-4">
              {hoveredCard.title}
            </h2>
            <div className="w-16 h-[1px] bg-white/40 mb-4" />
            <p className="text-zinc-200 text-lg font-light leading-relaxed mb-2 drop-shadow-md">
              {hoveredCard.description}
            </p>
            <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mt-2">
              {hoveredCard.promptContext}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center opacity-50">
            <div className="w-1 h-8 bg-zinc-700 mb-4 rounded-full" />
            <p className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase transition-opacity duration-500">
              Select a module to explore
            </p>
          </div>
        )}
      </footer>

      {/* Modal */}
      <InfoModal 
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedCard?.title || ''}
        content={aiContent}
        isLoading={loading}
      />

    </div>
  );
};

export default App;