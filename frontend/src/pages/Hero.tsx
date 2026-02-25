import React from 'react';
import * as motion from "motion/react-client";
import { useNavigate } from 'react-router-dom';
import RotatingText from "../components/RotatingText";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/pengumuman');
  };

  return (
    <div className="min-h-[85dvh] flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
      
      {/* Headline */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 animated-gradient-text cursor-default inline-block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        JADWALIN AJAH
      </motion.h1>
      
      {/* Sub Headline */}
      <p className="text-base sm:text-lg md:text-2xl text-black/70 font-normal mb-8 md:mb-12 flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center text-center">
        <RotatingText
          texts={["Jadwal", "Materi", "Informasi"]}
          rotationInterval={2000}
          staggerDuration={0}
          mainClassName="font-semibold text-black"
        />
        <span>Kelas dalam Genggaman</span>
      </p>

      {/* CTA Button */}
      <button 
        onClick={handleStartClick}
        className="w-full sm:w-auto h-12 px-6 rounded-full bg-black text-white font-medium text-base md:text-lg transition-all duration-300 transform active:scale-95 hover:scale-105 hover:shadow-lg mb-12 md:mb-20"
      >
        Langsung Ajah
      </button>

      <div className="flex flex-col items-center gap-1 md:gap-2">
        <p className="text-[11px] md:text-[13px] tracking-[0.25em] uppercase text-black/50 font-medium">
          Made for
        </p>
        <p className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-black font-bold">
          2KA19
        </p>
      </div>
    </div>
  );
};

export default Hero;