import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white py-12 px-6 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        
        {/* Left Column: Contact & Social */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold tracking-wide">Kontak</h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
            Hubungi kami untuk informasi kelas terbaru
          </p>
          <a 
            href="#" 
            className="mt-2 inline-block p-1 hover:text-pink-400 transition-colors w-fit"
            aria-label="Instagram"
          >
            <Instagram size={28} />
          </a>
        </div>

        {/* Middle Column: Email */}
        <div className="flex flex-col gap-4 md:mt-0 mt-4">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-200">EMAIL</h4>
          <a href="mailto:info@jadwalinajah.com" className="text-gray-200 hover:text-white transition-colors">
            info@jadwalinajah.com
          </a>
        </div>

        {/* Right Column: Phone & Copyright */}
        <div className="flex flex-col gap-4 md:mt-0 mt-4 justify-between h-full">
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-200 mb-4">TELEPON</h4>
            <a href="tel:+6281315153099" className="text-gray-200 hover:text-white transition-colors">
              +62 813 1515 3099
            </a>
          </div>
          
          <div className="text-xs text-gray-400 mt-8 md:mt-auto">
            © 2025. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;