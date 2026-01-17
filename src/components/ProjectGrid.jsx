import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRightLeft } from 'lucide-react';

// Dashboard Card
const DashboardCard = ({ project }) => {
  return (
    <div className="relative group h-64 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 cursor-pointer">
      {/* Placeholder Image Area */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-2 opacity-20 w-3/4 h-3/4">
            <div className="bg-cyan-500 rounded-md h-full col-span-2"></div>
            <div className="bg-emerald-500 rounded-md h-24"></div>
            <div className="bg-violet-500 rounded-md h-24"></div>
        </div>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-slate-900/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">{project.title}</h3>
        <div className="space-y-3 font-mono text-sm text-slate-300 w-full">
          {project.stats.map((stat, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">{stat.label}</span>
              <span className="text-emerald-400">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Label when not hovering */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 group-hover:opacity-0 transition-opacity">
        Dashboard View
      </div>
    </div>
  );
};

// Terminal Card
const TerminalCard = ({ project }) => {
  const logs = [
    "[INFO] Initializing connection...",
    "[INFO] Handshake successful",
    "[SUCCESS] Connected to DB_SHARD_01",
    "[STREAM] Receiving data packets...",
    "[CHECK] Latency: 12ms",
    "[PROCESS] Normalizing dataset...",
    "[INFO] 1402 records processed",
    "[WARN] Minor packet loss detected",
    "[RETRY] Retrying packet 402...",
    "[SUCCESS] Data integrity verified",
    "[SYSTEM] Sleeping for 200ms..."
  ];

  return (
    <div className="h-64 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col font-mono text-xs shadow-2xl shadow-emerald-500/5">
      {/* Terminal Header */}
      <div className="bg-slate-900 px-4 py-2 flex gap-2 items-center border-b border-slate-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="ml-2 text-slate-500 text-[10px]">monitor.exe — 80x24</span>
      </div>
      
      {/* Terminal Body */}
      <div className="p-4 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
        <motion.div
          animate={{ y: [0, -200] }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            ease: "linear" 
          }}
          className="absolute top-0 left-4 right-4 space-y-1"
        >
          {[...logs, ...logs, ...logs].map((log, i) => (
            <div key={i} className="text-emerald-500/90 font-mono">
              <span className="text-slate-600 mr-2">{`>`}</span>
              {log}
            </div>
          ))}
        </motion.div>
        
        {/* Overlay Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
           <h3 className="text-lg font-bold text-white">{project.title}</h3>
        </div>
      </div>
    </div>
  );
};

// Comparison Card (Slider)
const ComparisonCard = ({ project }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX, rect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleInteractionStart = (clientX, rect) => {
    setIsDragging(true);
    handleMove(clientX, rect);
  };

  return (
    <div 
      className="h-64 rounded-xl overflow-hidden border border-slate-700 relative select-none cursor-col-resize group"
      onMouseDown={(e) => handleInteractionStart(e.clientX, e.currentTarget.getBoundingClientRect())}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* "After" Layer (Clean Data) - Background */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-6">
        <div className="font-mono text-[10px] leading-relaxed text-cyan-300 opacity-80 w-full">
          <pre>{`{
  "invoice_id": "INV-2024-001",
  "date": "2024-12-14",
  "items": [
    { "desc": "Consulting", "amt": 1200 },
    { "desc": "Data Clean", "amt": 800 }
  ],
  "total": 2000.00,
  "status": "processed"
}`}</pre>
        </div>
      </div>

      {/* "Before" Layer (Messy Data) - Foreground with Clip Path */}
      <div 
        className="absolute inset-0 bg-slate-200 flex items-center justify-center overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="blur-[2px] font-serif text-slate-800 p-8 w-full text-center transform rotate-1 scale-110 origin-center">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-slate-800 inline-block">INVOICE</h2>
          <div className="text-left max-w-[150px] mx-auto space-y-2">
            <div className="h-2 bg-slate-400 w-3/4 rounded"></div>
            <div className="h-2 bg-slate-400 w-1/2 rounded"></div>
            <div className="h-2 bg-slate-400 w-full rounded"></div>
            <div className="h-2 bg-slate-400 w-2/3 rounded"></div>
          </div>
          <div className="mt-8 text-right font-bold text-xl text-slate-900">$2,000.00</div>
        </div>
        <div className="absolute bottom-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          Raw Input
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center -ml-0.5 transform transition-transform group-hover:scale-110">
          <ArrowRightLeft size={14} className="text-slate-900" />
        </div>
      </div>
      
      <div className="absolute top-4 right-4 bg-slate-900/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-slate-700 font-mono">
        {project.title}
      </div>
    </div>
  );
};

const ProjectGrid = ({ projects }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          {project.type === 'dashboard' && <DashboardCard project={project} />}
          {project.type === 'terminal' && <TerminalCard project={project} />}
          {project.type === 'comparison' && <ComparisonCard project={project} />}
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid;
