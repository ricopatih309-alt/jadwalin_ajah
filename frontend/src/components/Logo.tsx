import React from 'react';

const Logo: React.FC = () => {
  return (
    <div 
      className="flex items-center gap-3 transform duration-200 ease-in-out active:scale-110 hover:scale-105"
    >
      
      <div className="grid grid-cols-2 gap-1 w-8 h-8">
        <div className="w-full h-full rounded-full bg-purple-500 opacity-80"></div>
        <div className="w-full h-full rounded-full bg-pink-500 opacity-60"></div>
        <div className="w-full h-full rounded-full bg-blue-400 opacity-80"></div>
        <div className="w-full h-full rounded-full bg-purple-400 opacity-50"></div>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-lg text-pink-500 tracking-wide">JADWALIN</span>
        <span className="font-bold text-lg text-purple-500 tracking-wide -mt-1">AJAH</span>
      </div>
    </div>
  );
};

export default Logo;