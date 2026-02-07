import React from 'react';
import * as motion from "motion/react-client"
import RotatingText from "./RotatingText";

 
interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const handleStartClick = () => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate to announcements page
    onNavigate('pengumuman');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
      
      {/*Headline*/}
      <motion.h1 
        className="text-6xl md:text-8xl font-black tracking-tighter mb-6 animated-gradient-text cursor-default inline-block"
        style={{ letterSpacing: '-2px' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => console.log('hover started!')}>

        JADWALIN AJAH
      </motion.h1>
      
      {/*Sub Headline*/}
      <p className="text-xl md:text-2xl text-black/70 font-normal mb-12 flex gap-2 justify-center items-center">
        <RotatingText
        texts={["Jadwal", "Materi", "Informasi"]}
        rotationInterval={2000}
        staggerDuration={0}
         mainClassName="font-semibold text-black"
        />
        <span>Kelas dalam Genggaman</span>
      </p>

      {/* Professional CTA Button */}
      <button 
        id="btn-start"
        data-target="pengumuman"
        onClick={handleStartClick}
        className="px-8 py-3.5 rounded-full bg-black text-white font-medium text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] mb-20 animate-fade-in-up active:scale-95" 
        style={{ animationDelay: '100ms' }}
      >
        Langsung Ajah
      </button>

      {/* Minimalist Credit Footer */}
      <div className="flex flex-col items-center gap-2 animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/50 font-medium">
          Made by
        </p>
        <p className="text-xs tracking-[0.3em] uppercase text-black font-bold">
          KELOMPOK 6
        </p>
      </div>
    </div>
  );
};

export default Hero;