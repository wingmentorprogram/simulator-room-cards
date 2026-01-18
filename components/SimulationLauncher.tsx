import React, { useState, useEffect } from 'react';
import { X, Activity, Cpu, Globe, Rocket } from 'lucide-react';

interface SimulationLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const SimulationLauncher: React.FC<SimulationLauncherProps> = ({ isOpen, onClose, url }) => {
  const [bootProgress, setBootProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Terminal...');

  useEffect(() => {
    if (!isOpen) {
      setBootProgress(0);
      setStatus('Initializing Terminal...');
      return;
    }

    const steps = [
      { p: 10, s: 'Establishing Satellite Uplink...' },
      { p: 30, s: 'Allocating Hardware Buffers...' },
      { p: 55, s: 'Syncing GeoFS 3.9 Datasets...' },
      { p: 80, s: 'Optimizing GPU Render Path...' },
      { p: 100, s: 'Connection Secure. Launching External Viewport.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setBootProgress(steps[currentStep].p);
        setStatus(steps[currentStep].s);
        currentStep++;
      } else {
        clearInterval(interval);
        // Launch simulation in a standalone window with minimal UI
        const width = window.screen.availWidth;
        const height = window.screen.availHeight;
        const features = `width=${width},height=${height},top=0,left=0,location=no,menubar=no,status=no,toolbar=no,scrollbars=no`;
        window.open(url, 'GeoFSSimulator', features);
        
        // Brief delay before closing the launcher overlay
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen, url, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 p-12 relative overflow-hidden">
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
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-12">Redirecting to External Graphics Engine</p>

          <div className="w-full space-y-6">
            <div className="flex justify-between items-end text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              <span className="flex items-center gap-2">
                <Activity size={12} className="text-green-500" />
                {status}
              </span>
              <span>{bootProgress}%</span>
            </div>
            
            <div className="h-1 w-full bg-white/5 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-700 ease-out"
                style={{ width: `${bootProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex flex-col items-center opacity-40">
                <Cpu size={16} className="mb-2" />
                <span className="text-[8px] uppercase tracking-widest">Process</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <Globe size={16} className="mb-2" />
                <span className="text-[8px] uppercase tracking-widest">Network</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <Activity size={16} className="mb-2" />
                <span className="text-[8px] uppercase tracking-widest">Telemetry</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default SimulationLauncher;