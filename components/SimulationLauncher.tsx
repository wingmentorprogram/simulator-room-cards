import React, { useState, useEffect } from 'react';
import { X, Activity, Cpu, Globe, Rocket, ExternalLink } from 'lucide-react';

interface SimulationLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const SimulationLauncher: React.FC<SimulationLauncherProps> = ({ isOpen, onClose, url }) => {
  const [bootProgress, setBootProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Terminal...');
  const [isReady, setIsReady] = useState(false);

  const launchWindow = () => {
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    const features = `width=${width},height=${height},top=0,left=0,location=no,menubar=no,status=no,toolbar=no,scrollbars=no`;
    const newWindow = window.open(url, 'GeoFSSimulator', features);
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      setStatus('Popup Blocked. Please click below to launch.');
      setIsReady(true);
    } else {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setBootProgress(0);
      setStatus('Initializing Terminal...');
      setIsReady(false);
      return;
    }

    const steps = [
      { p: 10, s: 'Establishing Satellite Uplink...' },
      { p: 30, s: 'Allocating Hardware Buffers...' },
      { p: 55, s: 'Syncing GeoFS Datasets...' },
      { p: 80, s: 'Optimizing GPU Render Path...' },
      { p: 100, s: 'System Ready. Handing over control.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setBootProgress(steps[currentStep].p);
        setStatus(steps[currentStep].s);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsReady(true);
        launchWindow();
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen, url]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 p-12 relative overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]">
        {/* Decorative Scanned Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 animate-pulse">
            <Rocket className="text-white/60" size={32} />
          </div>

          <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-white mb-2">Simulation Handover</h2>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-12">Redirecting to External Viewport</p>

          <div className="w-full space-y-6">
            <div className="flex justify-between items-end text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              <span className="flex items-center gap-2">
                <Activity size={12} className={bootProgress === 100 ? "text-green-500" : "text-blue-500 animate-pulse"} />
                {status}
              </span>
              <span>{bootProgress}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-white/5 overflow-hidden rounded-full">
              <div 
                className={`h-full bg-white transition-all duration-700 ease-out ${bootProgress === 100 ? 'shadow-[0_0_10px_white]' : ''}`}
                style={{ width: `${bootProgress}%` }}
              />
            </div>

            {isReady && (
              <div className="animate-fade-in pt-4 flex flex-col items-center">
                <button 
                  onClick={launchWindow}
                  className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-sm font-bold tracking-[0.2em] uppercase text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <ExternalLink size={16} />
                  Initialize Manual Launch
                </button>
                <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-tighter">
                  If simulation fails to open, ensure pop-ups are allowed
                </p>
              </div>
            )}

            {!isReady && (
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="flex flex-col items-center opacity-40">
                  <Cpu size={16} className="mb-2" />
                  <span className="text-[8px] uppercase tracking-widest font-bold">Process</span>
                </div>
                <div className="flex flex-col items-center opacity-40">
                  <Globe size={16} className="mb-2" />
                  <span className="text-[8px] uppercase tracking-widest font-bold">Network</span>
                </div>
                <div className="flex flex-col items-center opacity-40">
                  <Activity size={16} className="mb-2" />
                  <span className="text-[8px] uppercase tracking-widest font-bold">Telemetry</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default SimulationLauncher;