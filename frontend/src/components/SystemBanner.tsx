import React from 'react';

const SystemBanner: React.FC = () => {
  return (
    <div 
      id="announcement-ticker" 
      className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-[#FFC0CB]/30 text-[#FFC0CB] z-60 py-2 overflow-hidden shadow-sm"
    >
      <div className="whitespace-nowrap animate-ticker font-sans italic font-medium text-[13px] uppercase tracking-[1px] w-max">
        SYSTEM INFO: SYSTEM DATABASE MAINTENANCE WILL BE PERFORMED ON SUNDAYS FROM 22.00 - 00.00 WIB. THE SERVICE MAY BE TEMPORARILY INACCESSIBLE.
      </div>
    </div>
  );
};

export default SystemBanner;