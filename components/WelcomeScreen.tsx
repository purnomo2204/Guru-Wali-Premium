
import React from 'react';
import { LogIn } from 'lucide-react';
import { TeacherData } from '../types';

interface WelcomeScreenProps {
  onEnter: () => void;
  teacherData: TeacherData;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, teacherData }) => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 text-center max-w-2xl">
        <div className="mb-8 inline-block p-4 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <span className="text-4xl font-bold font-orbitron">
              AGW
            </span>
          </div>
          <h2 className="text-slate-400 font-medium tracking-widest uppercase text-xs">Aplikasi Guru Wali</h2>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-orbitron leading-tight">
          Selamat Datang di <br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Aplikasi Guru Wali
          </span>
        </h1>
        
        <div className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
          <p className="font-bold text-slate-100">{teacherData.name}</p>
          <p>{teacherData.school}</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 metallic-black hover:scale-105 active:scale-95 border border-slate-700 shadow-xl"
          >
            <span className="flex items-center gap-3">
              MASUK APLIKASI
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <p className="text-slate-500 text-xs font-medium italic opacity-80">
            Aplikasi ini dibuat oleh : W. Purnomo - SMP Negeri 2 Magelang
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 text-slate-500 text-sm font-medium tracking-wider">
        PREMIUM EDITION V2.5
      </div>
    </div>
  );
};

export default WelcomeScreen;
