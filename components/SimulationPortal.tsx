import React, { useState, useEffect } from 'react';
import { X, ClipboardList, Activity, Globe, Compass, Shield, ChevronLeft, ChevronRight, CheckCircle2, Navigation } from 'lucide-react';

interface SimulationPortalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  completed: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', category: 'Pre-Flight', task: 'Master Switch: ON', completed: false },
  { id: '2', category: 'Pre-Flight', task: 'Fuel Quantity: CHECKED', completed: false },
  { id: '3', category: 'Pre-Flight', task: 'Flaps: SET FOR T.O.', completed: false },
  { id: '4', category: 'Engine Start', task: 'Prop Area: CLEAR', completed: false },
  { id: '5', category: 'Engine Start', task: 'Ignition: START', completed: false },
  { id: '6', category: 'Before Take-off', task: 'Flight Controls: FREE/CORRECT', completed: false },
  { id: '7', category: 'Before Take-off', task: 'Trim: SET NEUTRAL', completed: false },
  { id: '8', category: 'In-Flight', task: 'Landing Gear: RETRACT', completed: false },
  { id: '9', category: 'In-Flight', task: 'Airspeed: MAINTAIN', completed: false },
];

const SimulationPortal: React.FC<SimulationPortalProps> = ({ isOpen, onClose, url, title }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [simData, setSimData] = useState({ alt: 0, spd: 0, hdg: 0 });

  // Simulate some telemetry movement for aesthetic effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSimData(prev => ({
        alt: Math.max(0, prev.alt + (Math.random() - 0.4) * 10),
        spd: Math.max(0, prev.spd + (Math.random() - 0.4) * 2),
        hdg: (prev.hdg + (Math.random() - 0.5) * 1 + 360) % 360,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in overflow-hidden font-sans">
      {/* Top Telemetry Bar */}
      <header className="h-14 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-white text-[11px] font-bold tracking-[0.3em] uppercase">{title}</h2>
          </div>
          
          <div className="hidden md:flex items-center gap-8 border-l border-white/10 pl-8">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest">Altitude</span>
              <span className="text-white font-mono text-xs">{Math.floor(simData.alt).toLocaleString()} FT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest">Airspeed</span>
              <span className="text-white font-mono text-xs">{Math.floor(simData.spd)} KTS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest">Heading</span>
              <span className="text-white font-mono text-xs">{Math.floor(simData.hdg)}°</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10">
            <Activity size={12} className="text-blue-400" />
            <span className="text-blue-400 text-[9px] font-bold tracking-widest uppercase">Link Stable</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all rounded"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar: Flight Directory / Checklist */}
        <aside 
          className={`bg-zinc-950 border-r border-white/10 transition-all duration-500 ease-in-out flex flex-col z-10 ${
            sidebarOpen ? 'w-[320px]' : 'w-0'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-6 min-w-[320px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-white/40" size={18} />
                <h3 className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">Flight Directory</h3>
              </div>
              <span className="text-zinc-600 text-[9px] font-mono">V.3.9.0</span>
            </div>

            {/* Checklist Sections */}
            {['Pre-Flight', 'Engine Start', 'Before Take-off', 'In-Flight'].map(category => (
              <div key={category} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">{category}</span>
                  <div className="h-[1px] w-4 bg-white/10" />
                </div>
                
                <div className="space-y-2">
                  {checklist.filter(item => item.category === category).map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded border transition-all duration-300 text-left group ${
                        item.completed 
                          ? 'bg-green-500/10 border-green-500/30 text-green-200/80' 
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-[11px] font-medium tracking-wide">{item.task}</span>
                      {item.completed ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-sm border border-white/20 group-hover:border-white/40 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Mission Info Placeholder */}
            <div className="mt-12 p-4 bg-zinc-900/50 border border-white/5 rounded">
              <div className="flex items-center gap-2 mb-3">
                <Navigation size={12} className="text-zinc-500" />
                <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Mission Telemetry</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-zinc-600">Route</span>
                  <span className="text-[10px] text-zinc-300">VFR LOCAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-zinc-600">Fuel Remaining</span>
                  <span className="text-[10px] text-zinc-300">82%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-zinc-900 border border-white/10 p-1 rounded-r text-zinc-400 hover:text-white transition-all shadow-xl"
          style={{ transform: `translateX(${sidebarOpen ? '320px' : '0'}) translateY(-50%)` }}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Main Simulator Frame */}
        <main className="flex-1 bg-black relative">
          <iframe 
            src={url}
            className="w-full h-full border-none"
            title="GeoFS Simulation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Subtle Scanned Line Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          
          {/* Glass Reflection Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-50" />
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-zinc-950 border-t border-white/10 flex items-center justify-between px-6 shrink-0 text-[9px] font-mono tracking-tighter text-zinc-500 uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Globe size={10} className="text-zinc-600" />
            TERRAIN ENGINE: ACTIVE
          </span>
          <span className="flex items-center gap-1.5">
            <Compass size={10} className="text-zinc-600" />
            MAGNETIC VAR: +12.4
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Shield size={10} className="text-green-900" />
            SECURE LINK 128-BIT
          </span>
          <span className="text-zinc-700">|</span>
          <span>SYSTEM TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default SimulationPortal;