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
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col font-sans relative pt-9">
    <SystemBanner />
    <Navbar />
    <main className="grow relative z-10">
      <div className="-mt-24 pt-24 min-h-screen flex flex-col">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={(
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        )}
      />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Hero />} />
        <Route path="/pengumuman" element={<AnnouncementPage />} />
        <Route path="/kalender" element={<CalendarPage />} />
        <Route path="/anggota" element={<MembersPage />} />
        <Route path="/jadwal" element={<SchedulePage />} />
        <Route path="/materi" element={<CourseMaterialsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;