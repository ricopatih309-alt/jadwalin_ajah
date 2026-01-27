import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string) => {
    // 1. Smooth scroll to top (Start of the section)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 2. Trigger Navigation State Change
    onNavigate(page);

    // 3. Close Menus
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { label: 'Pengumuman', id: 'pengumuman' },
    { label: 'Kalender Akademik', id: 'kalender' },
    { label: 'Anggota Kelas', id: 'anggota' },
    { label: 'Jadwal Kuliah', id: 'jadwal' },
    { label: 'Daftar Mata Kuliah', id: 'materi' },
  ];

  return (
    <nav 
      className={`sticky top-9 left-0 w-full z-40 px-6 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-4' 
          : 'bg-transparent py-6 md:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="cursor-pointer group" onClick={() => handleNavClick('dashboard')}>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleNavClick('dashboard')}
            className={`font-semibold pb-0.5 transition-all duration-300 ${
              activePage === 'dashboard' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-slate-800 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-200'
            }`}
          >
            Beranda
          </button>
          
          <div className="relative">
            <button 
              className={`flex items-center gap-1 font-medium hover:text-purple-600 transition-colors py-2 ${
                activePage !== 'dashboard' ? 'text-purple-600' : 'text-slate-800'
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Close on blur with delay
            >
              Langsung Ajah
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <div className="py-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-all duration-200 border-l-4 ${
                      activePage === item.id 
                        ? 'border-brand-purple bg-purple-50 text-brand-purple' 
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-800 hover:bg-white/50 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-lg md:hidden flex flex-col z-50 border-t border-gray-100 transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'opacity-100 max-h-screen py-4' : 'opacity-0 max-h-0 py-0 overflow-hidden'}`}>
           <div className="px-6 flex flex-col gap-1">
             <button 
                onClick={() => handleNavClick('dashboard')} 
                className={`text-left py-3 px-4 rounded-xl font-bold transition-all ${
                  activePage === 'dashboard' 
                    ? 'bg-purple-50 text-purple-600' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
             >
               Beranda
             </button>
             
             <div className="border-t border-gray-200/50 my-2 mx-4"></div>
             <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Menu Utama</span>
             
             {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-3 px-4 rounded-xl font-medium transition-all ${
                    activePage === item.id 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
             ))}
           </div>
      </div>
    </nav>
  );
};

export default Navbar;