import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { VisualizationType } from '../types';

interface VisualizerProps {
  type: VisualizationType;
  topicName: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ type }) => {
  // State for interactivity
  const [resistance, setResistance] = useState(10); // Ohm's Law
  const [frequency, setFrequency] = useState(1);   // AC
  const [capacitance, setCapacitance] = useState(50); // RC

  // Data generators
  const generateOhmData = () => {
    const data = [];
    for (let v = 0; v <= 20; v += 2) {
      data.push({ voltage: v, current: parseFloat((v / resistance).toFixed(2)) });
    }
    return data;
  };

  const generateACData = () => {
    const data = [];
    for (let t = 0; t <= 360; t += 10) {
      const rad = (t * Math.PI) / 180;
      data.push({
        time: t,
        ac_voltage: Math.sin(rad * frequency) * 10,
        dc_voltage: 5
      });
    }
    return data;
  };

  const generateRCData = () => {
    const data = [];
    const R = 1000; // Fixed R for demo
    const C = capacitance * 1e-6; // microfarads
    const tau = R * C;
    const V_source = 10;
    
    // Plot for 5 time constants
    const maxTime = 5 * tau; 
    const steps = 20;
    const dt = maxTime / steps;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const v_c = V_source * (1 - Math.exp(-t / tau));
      data.push({ time: t.toFixed(4), voltage: parseFloat(v_c.toFixed(2)) });
    }
    return data;
  };

  const renderControls = () => {
    switch (type) {
      case VisualizationType.OHM_LAW:
        return (
          <div className="flex flex-col gap-4 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-slate-200">Resistance (R)</label>
               <span className="text-sm font-mono text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded">{resistance} Ω</span>
            </div>
            <input 
              type="range" min="1" max="50" value={resistance} 
              onChange={(e) => setResistance(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag to change resistance. Notice how <strong className="text-blue-400">Current (I)</strong> decreases as <strong className="text-slate-300">Resistance (R)</strong> increases for the same Voltage.
            </p>
          </div>
        );
      case VisualizationType.AC_WAVE:
        return (
           <div className="flex flex-col gap-4 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-slate-200">Frequency Multiplier</label>
               <span className="text-sm font-mono text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded">{frequency}x</span>
            </div>
            <input 
              type="range" min="1" max="5" step="0.5" value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
               className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
            />
             <p className="text-xs text-slate-400 leading-relaxed">
               The purple line is <strong className="text-purple-400">AC</strong> (fluctuates). The dashed green line is <strong className="text-green-400">DC</strong> (steady).
             </p>
          </div>
        );
      case VisualizationType.RC_CIRCUIT:
        return (
          <div className="flex flex-col gap-4 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-slate-200">Capacitance (C)</label>
               <span className="text-sm font-mono text-green-300 bg-green-900/30 px-2 py-0.5 rounded">{capacitance} μF</span>
            </div>
            <input 
              type="range" min="10" max="200" step="10" value={capacitance} 
              onChange={(e) => setCapacitance(Number(e.target.value))}
               className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
            />
             <p className="text-xs text-slate-400 leading-relaxed">
               Increasing capacitance makes the curve flatter, meaning it takes <strong className="text-green-400">longer to charge</strong> to full voltage.
             </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderChart = () => {
    switch (type) {
      case VisualizationType.OHM_LAW:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateOhmData()} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="voltage" stroke="#94a3b8" label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" label={{ value: 'Current (A)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }} 
                cursor={{ stroke: '#475569', strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 8 }} animationDuration={500} />
            </LineChart>
          </ResponsiveContainer>
        );
      case VisualizationType.AC_WAVE:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateACData()} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={false} label={{ value: 'Time →', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" domain={[-12, 12]} />
              <ReferenceLine y={0} stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }} />
              <Line type="basis" dataKey="ac_voltage" name="AC Voltage" stroke="#a855f7" strokeWidth={3} dot={false} animationDuration={300} />
              <Line type="monotone" dataKey="dc_voltage" name="DC Voltage" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      case VisualizationType.RC_CIRCUIT:
        return (
           <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={generateRCData()} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" domain={[0, 12]} label={{ value: 'Volts (V)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }} />
              <Area type="monotone" dataKey="voltage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="h-64 flex items-center justify-center text-slate-500">Visualization not available</div>;
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-full">
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center">
        <h3 className="font-bold text-slate-200 text-lg">Lab Simulation</h3>
        <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 font-medium tracking-wide">
          INTERACTIVE
        </span>
      </div>
      <div className="p-6 bg-slate-950 flex-grow flex flex-col justify-center min-h-[300px]">
        {renderChart()}
      </div>
      <div className="p-6 bg-slate-900 border-t border-slate-800">
        {renderControls()}
      </div>
    </div>
  );
};