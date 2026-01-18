
import React, { useState } from 'react';
import Card from './components/Card';
import InfoModal from './components/InfoModal';
import SimulationLauncher from './components/SimulationLauncher';
import SmokeBackground from './components/SmokeBackground';
import { CardData } from './types';
import { generateCreativeDescription } from './services/geminiService';

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
    externalUrl: 'https://www.geo-fs.com/geofs.php'
  },
  {
    id: '4',
    title: 'EBT Workload Management',
    type: 'image',
    src: 'https://lh3.googleusercontent.com/d/1QrldYBuGagHp8vRLsJ8EcNpwtwBW2ShL',
    promptContext: 'flight simulator cockpit, crew resource management, high workload aviation, complex scenario, pilot teamwork',
    description: 'Advanced scenario-based training. Enhancing resilience and decision-making through complex, evidence-based simulation.',
  },
];

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [hoveredCard, setHoveredCard] = useState<CardData | null>(null);
  const [aiContent, setAiContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCardClick = async (card: CardData) => {
    setSelectedCard(card);
    
    // Launch VFR planning externally using the specialized launcher for a full-window experience
    if (card.id === '3' && card.externalUrl) {
      setLauncherOpen(true);
      return;
    }

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

  const closeLauncher = () => {
    setLauncherOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const getTransformStyle = (index: number) => {
    const total = CARDS.length;
    const mid = (total - 1) / 2;
    const offset = index - mid;
    const rotateY = offset * -12; 
    const translateZ = Math.abs(offset) * 60; 
    const translateX = offset * 330;

    return {
      transform: `perspective(1500px) translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg)`,
      zIndex: 10 - Math.floor(Math.abs(offset)),
    };
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center overflow-hidden relative font-sans">
      
      <SmokeBackground />

      <header className="relative z-30 pt-12 pb-6 w-full text-center shrink-0">
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          The Simulator Room
        </h1>
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="h-[1px] w-16 bg-white/10" />
          <p className="text-zinc-500 text-[11px] md:text-xs tracking-[0.6em] uppercase font-bold">
            WingMentor Flight Training
          </p>
          <div className="h-[1px] w-16 bg-white/10" />
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full flex items-center justify-center perspective-[3000px]">
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

      <footer className="relative z-20 h-[15vh] min-h-[100px] w-full shrink-0 flex flex-col justify-center items-center pb-8">
        <div className="transition-all duration-700 ease-in-out flex flex-col items-center text-center">
          {hoveredCard ? (
            <div className="animate-slide-up flex flex-col items-center">
              <div className="h-1 w-16 bg-white/40 mb-4 rounded-full" />
              <p className="text-white text-sm md:text-base font-light italic leading-relaxed max-w-xl px-10 opacity-80">
                "{hoveredCard.description}"
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-1 h-10 bg-gradient-to-b from-white/20 to-transparent mb-4" />
              <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase font-bold">
                Select a Module to Initialize
              </p>
            </div>
          )}
        </div>
      </footer>

      <InfoModal 
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedCard?.title || ''}
        content={aiContent}
        isLoading={loading}
      />

      {launcherOpen && selectedCard?.externalUrl && (
        <SimulationLauncher 
          isOpen={launcherOpen}
          onClose={closeLauncher}
          url={selectedCard.externalUrl}
        />
      )}

    </div>
  );
};

export default App;
