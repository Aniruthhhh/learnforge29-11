"use client";

import React from 'react';
import { Compass, Cpu, Activity, Layers } from 'lucide-react';

const menuItems = [
  { title: 'Overview', icon: <Compass size={20} />, gradientFrom: '#a955ff', gradientTo: '#ea51ff', href: '#overview' },
  { title: 'How it Works', icon: <Cpu size={20} />, gradientFrom: '#56CCF2', gradientTo: '#2F80ED', href: '#how-it-works' },
  { title: 'Simulation', icon: <Activity size={20} />, gradientFrom: '#FF9966', gradientTo: '#FF5E62', href: '#simulation' },
  { title: 'Features', icon: <Layers size={20} />, gradientFrom: '#80FF72', gradientTo: '#7EE8FA', href: '#features' },
];

export default function GradientMenu() {
  return (
    <div className="flex justify-center items-center">
      <ul className="flex gap-4">
        {menuItems.map(({ title, icon, gradientFrom, gradientTo, href }, idx) => (
          <li
            key={idx}
            style={{ '--gradient-from': gradientFrom, '--gradient-to': gradientTo } as React.CSSProperties}
            className="relative w-[50px] h-[50px] bg-white/5 border border-white/10 shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[160px] hover:shadow-none hover:border-transparent group cursor-pointer"
          >
            <a href={href} className="absolute inset-0 z-20 rounded-full" aria-label={title} />
            
            {/* Gradient background on hover */}
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100"></span>
            
            {/* Blur glow */}
            <span className="absolute top-[8px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[12px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-60"></span>

            {/* Icon */}
            <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0 p-2">
              <span className="text-white/70 group-hover:text-white flex items-center justify-center">{icon}</span>
            </span>

            {/* Title */}
            <span className="absolute text-white uppercase tracking-wide text-xs font-bold transition-all duration-500 scale-0 group-hover:scale-100 delay-150 pointer-events-none">
              {title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
