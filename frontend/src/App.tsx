import React, { useState } from 'react';
import SystemBanner from './components/SystemBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import Footer from './components/Footer';
import AnnouncementPage from './components/AnnouncementPage';
import CalendarPage from './components/CalendarPage';
import MembersPage from './components/MembersPage';
import SchedulePage from './components/SchedulePage';
import CourseMaterialsPage from './components/CourseMaterialsPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Hero onNavigate={setActivePage} />;
      case 'pengumuman':
        return <AnnouncementPage />;
      case 'kalender':
        return <CalendarPage />;
      case 'anggota':
        return <MembersPage />;
      case 'jadwal':
        return <SchedulePage />;
      case 'materi':
        return <CourseMaterialsPage />;
      default:
        return <Hero onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative pt-9">
      {/* Background is now handled by body CSS in index.html */}
      
      <SystemBanner />
      
      {/* Main Content Wrapper */}
      <main className="grow relative z-10">
        <Navbar activePage={activePage} onNavigate={setActivePage} />
        <div className="-mt-24 pt-24 min-h-screen flex flex-col">
           {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;