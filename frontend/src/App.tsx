import React from 'react';
import SystemBanner from './components/SystemBanner';
import Navbar from './components/Navbar';
import Hero from './pages/Hero';
import Footer from './components/Footer';
import AnnouncementPage from './pages/AnnouncementPage';
import CalendarPage from './pages/CalendarPage';
import MembersPage from './pages/MembersPage';
import SchedulePage from './pages/SchedulePage';
import CourseMaterialsPage from './pages/CourseMaterialsPage';

import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative pt-9">
      {/* Backgorund di handle body css di index.html */}
      <SystemBanner />

      <Navbar />
      <main className="grow relative z-10">
        <div className="-mt-24 pt-24 min-h-screen flex flex-col">
          
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/pengumuman" element={<AnnouncementPage />} />
            <Route path="/kalender" element={<CalendarPage />} />
            <Route path="/anggota" element={<MembersPage />} />
            <Route path="/jadwal" element={<SchedulePage />} />
            <Route path="/materi" element={<CourseMaterialsPage />} />
          </Routes>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;