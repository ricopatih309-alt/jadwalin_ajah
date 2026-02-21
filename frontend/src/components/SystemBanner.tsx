import React from 'react';

const SystemBanner: React.FC = () => {
  return (
    <div 
      id="announcement-ticker" 
      className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-[#FFC0CB]/30 text-[#FFC0CB] z-60 py-2 overflow-hidden shadow-sm"
    >
      <div className="whitespace-nowrap animate-ticker font-sans italic font-medium text-[13px] uppercase tracking-[1px] w-max">
        INFO SISTEM: Pemeliharaan sistem dilakukan setiap Sabtu pukul 18.00–23.00 WIB. Layanan mungkin tidak dapat diakses sementara.
      </div>
    </div>
  );
};

export default SystemBanner;