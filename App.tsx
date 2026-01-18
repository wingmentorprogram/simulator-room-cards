import React, { useState } from 'react';
import Card from './components/Card';
import InfoModal from './components/InfoModal';
import SmokeBackground from './components/SmokeBackground';
import { CardData } from './types';
import { generateCreativeDescription } from './services/geminiService';

// Aviation themed data with specific image replacements
const CARDS: CardData[] = [
  {
    id: '1',
    title: 'IFR Procedures & Charts',
    type: 'image',
    src: 'https://lh3.googleusercontent.com/d/1N9ZtcYg4xJai_dtg-Nk3IxsoiBoOSwFI',
    promptContext: 'cockpit flight instruments, IFR charts, navigation, aviation precision, night flight, digital flight deck',
    description: 'Mastering the unseen paths of the sky. Precision navigation through clouds and darkness using advanced instrumentation and digital charts.',
  },
  {
    id: '2',
    title: 'Check Ride Interview Preparation',
    type: 'image',
    src: 'https://lh3.googleusercontent.com/d/1BPZ7HTU_Oxu3eCi_4P-8mimtjDmsmjeU', 
    promptContext: 'pilot pre-flight inspection, aviation interview, confident aviator, airline pilot uniform, professionalism',
    description: 'The culmination of training and discipline. Preparing to demonstrate the knowledge, skill, and poise of a professional aviator.',
  },
  {
    id: '3',
    title: 'VFR and Cross Country Planning',
    type: 'image',
    src: 'https://lh3.googleusercontent.com/d/1RbWNolLohmr4dX9FzSdzGLHNWPCWppob',
    promptContext: 'aerial view of mountains, clear blue sky, visual flight rules, freedom of flight, scenic landscape, aviation navigation',
    description: 'The pure freedom of visual flight. Soaring over breathtaking landscapes with the horizon as your primary guide.',
  },
  {
    id: '4',
    title: 'EBT Workload Management',
    type: 'image',
    // Updated with the user-provided image link
    src: 'https://lh3.googleusercontent.com/d/1QrldYBuGagHp8vRLsJ8EcNpwtwBW2ShL',
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
    setAiContent('');

    const description = await generateCreativeDescription(card.promptContext);
    setAiContent(description);
    setLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const getTransformStyle = (index: number) => {
    const total = CARDS.length;
    const mid = (total - 1) / 2;
    const offset = index - mid;
    
    // Concave 3D fan layout
    const rotateY = offset * -10; 
    const translateZ = Math.abs(offset) * 40; 
    const translateX = offset * 320;

    return {
      transform: `perspective(1200px) translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg)`,
      zIndex: 10 - Math.floor(Math.abs(offset)),
    };
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center overflow-hidden relative font-sans">
      
      <SmokeBackground />

      {/* Header Section */}
      <header className="relative z-30 pt-10 pb-4 w-full text-center shrink-0">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
          The Simulator Room
        </h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-white/20" />
          <p className="text-zinc-400 text-[10px] md:text-xs tracking-[0.4em] uppercase font-semibold">
            WingMentor Flight Modules
          </p>
          <div className="h-[1px] w-12 bg-white/20" />
        </div>
      </header>

      {/* Interactive Cards Display */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center perspective-[2500px]">
        <div className="relative w-full h-full flex items-center justify-center">
          {CARDS.map((card, index) => (
            <div 
              key={card.id}
              className="absolute transition-all duration-1000 ease-out preserve-3d top-1/2 left-1/2 -ml-[140px] -mt-[260px]" 
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
        </div>
      </main>

      {/* Dynamic Status/Instruction Footer */}
      <footer className="relative z-20 h-[18vh] min-h-[120px] w-full shrink-0 flex flex-col justify-center items-center pb-10">
        <div className="transition-all duration-700 ease-in-out flex flex-col items-center text-center">
          {hoveredCard ? (
            <div className="animate-slide-up flex flex-col items-center">
              <div className="h-1 w-20 bg-white/60 mb-6 rounded-full blur-[1px]" />
              <p className="text-white text-sm md:text-base font-light italic leading-relaxed max-w-xl px-6 opacity-90 drop-shadow-md">
                "{hoveredCard.description}"
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-1 h-12 bg-gradient-to-b from-white/40 to-transparent mb-4 rounded-full" />
              <p className="text-zinc-500 text-[9px] tracking-[0.5em] uppercase font-bold">
                Engage a system to initialize simulation
              </p>
            </div>
          )}
        </div>
      </footer>

      {/* Detail View Modal */}
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