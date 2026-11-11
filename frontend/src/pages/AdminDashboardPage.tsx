import { useState, type ComponentType } from 'react';
import { Bell, BookOpen, CalendarDays, GraduationCap, LogOut, Megaphone, Menu, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PengumumanManager from '../components/PengumumanManager';
import CalendarManager from '../components/CalendarManager';
import MateriKuliahManager from '../components/MateriKuliahManager';
import JadwalKuliahManager from '../components/JadwalKuliahManager';
import NamaMahasiswaManager from '../components/NamaMahasiswaManager';
import TugasManager from '../components/TugasManager';

type DashboardTab = 'schedules' | 'tasks' | 'announcements' | 'calendar' | 'students' | 'materi';

const tabs: { id: DashboardTab; label: string; icon: typeof CalendarDays; manager: ComponentType }[] = [
  { id: 'schedules', label: 'Update Jadwal Kuliah', icon: CalendarDays, manager: JadwalKuliahManager },
  { id: 'tasks', label: 'Update Tugas', icon: Bell, manager: TugasManager },
  { id: 'announcements', label: 'Update Pengumuman', icon: Megaphone, manager: PengumumanManager },
  { id: 'calendar', label: 'Update Kalender Akademik', icon: CalendarDays, manager: CalendarManager },
  { id: 'students', label: 'Update Nama Mahasiswa', icon: Users, manager: NamaMahasiswaManager },
  { id: 'materi', label: 'Update Materi Kuliah', icon: BookOpen, manager: MateriKuliahManager },
];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('schedules');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const ActiveManager = selectedTab.manager;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('adminProfile');
    navigate('/admin/login', { replace: true });
  };

  let adminName = 'Administrator';
  try {
    const profile = JSON.parse(localStorage.getItem('adminProfile') ?? '{}') as { name?: string };
    adminName = profile.name || adminName;
  } catch {
    localStorage.removeItem('adminProfile');
  }

  const renderTabButtons = (mobile = false) => tabs.map((tab) => {
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        onClick={() => {
          setActiveTab(tab.id);
          setIsMobileMenuOpen(false);
        }}
        className={`${mobile ? 'shrink-0' : 'w-full'} flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
          activeTab === tab.id ? 'bg-blue-50 text-brand-blue' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon size={18} />
        {tab.label}
      </button>
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/90 text-slate-900">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-brand-blue">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Jadwalin Ajah</p>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-slate-600 sm:inline">{adminName}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-screen-2xl lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white p-4 lg:block">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Menu</p>
          <nav role="tablist" aria-label="Menu admin" className="space-y-1">
            {renderTabButtons()}
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <nav role="tablist" aria-label="Menu admin" className="col-span-full flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-3 lg:hidden">
            {renderTabButtons(true)}
          </nav>
        )}

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold">{selectedTab.label}</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola dan tinjau data akademik.</p>
          </div>

          <ActiveManager />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;