import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-6 px-6 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-4">
        
        {/* Kolom Kiri Developed */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">Developed by</h4>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
            Anthony Frederico Pati
          </p>
        </div>

        {/* Kolom Tengah Team */}
        <div className="flex flex-col gap-4 md:mt-0 mt-4">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">Supported by</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>Ardhelia Intan Permatasari</li>
            <li>Rafi Raihan Putra Noviantara</li>
            <li>Wildan Akbar Fahrezi</li>
          </ul>
        </div>

        {/* Kolom  Kanan Hosting */}
        <div className="flex flex-col gap-4 md:mt-0 mt-4">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">Hosted On</h4>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
            Private Home Server <span className="text-white">Dio Nugroho</span>
          </p>
        </div>

      </div>

      {/* Bottom Credit Bar */}
      <div className="border-t border-white/20 py-4 text-center text-xs text-gray-400">
        © 2026 <span className="text-gray-300">Jadwalin Ajah</span>.  
        All Rights Reserved Terms of Use and Privacy Policy  
      </div>
    </footer>
  );
};

export default Footer;