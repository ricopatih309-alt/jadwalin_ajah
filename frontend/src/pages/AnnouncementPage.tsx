import React, { useState, useEffect } from 'react';
import type { Task, Announcement } from '../types/types';
import { X, Calendar, Clock, AlertCircle, Search, ChevronDown } from 'lucide-react';

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-slate-900 font-bold px-0.5 rounded-xs">{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const AnnouncementPage: React.FC = () => {
  // State untuk menampung data dari database
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const [announcementsData, setAnnouncementsData] = useState<Announcement[]>([]);
  const [loading, setloading] = useState(true); // State untuk loading data
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<number | null>(null);

  // Ambil data dari Backend saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const resTasks = await fetch('http://localhost:3001/api/tasks');
        const resAnnounce = await fetch('http://localhost:3001/api/announcements');
        
        const tasks = await resTasks.json();
        const announcements = await resAnnounce.json();

        setTasksData(tasks);
        setAnnouncementsData(announcements);
      } catch (error) {
        console.error("Data tidak terbaca", error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  const toggleAnnouncement = (id: number) => {
    setExpandedAnnouncementId(prev => prev === id ? null : id);
  };
  const closeModal = () => setSelectedTask(null); 

  // Filter Logic - Extended to include dates/deadlines
  const filteredTasks = tasksData.filter(task => 
    task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.deadline && task.deadline.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAnnouncements = announcementsData.filter(announcement => 
    announcement.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.trim().length > 0;
  const noResults = isSearching && filteredTasks.length === 0 && filteredAnnouncements.length === 0;
  const showTasks = filteredTasks.length > 0;
  const showAnnouncements = filteredAnnouncements.length > 0;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-brand-blue font-bold">
        Memuat data dari database...
      </div>
    );
  }

  return (
    <section id="pengumuman" className="w-full max-w-5xl mx-auto px-4 pt-28 pb-16">
      
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-brand-dark mb-8 uppercase tracking-tight drop-shadow-sm border-l-8 border-brand-blue pl-4 animate-fade-in-down">
        Pengumuman
      </h1>

      {/* Sticky Search Bar */}
      <div className="sticky top-31 z-30 mb-10 animate-fade-in-down" style={{ animationDelay: '50ms' }}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-10 py-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl leading-5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue/50 shadow-lg transition-all duration-300 ease-out"
            placeholder="Cari mata kuliah, tugas, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* No Results State */}
      {noResults && (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-4 shadow-inner">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Tidak ditemukan</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Kami tidak dapat menemukan tugas atau pengumuman yang cocok dengan pencarian "{searchQuery}". Coba gunakan kata kunci lain.
          </p>
          <button 
            onClick={() => setSearchQuery('')} 
            className="mt-6 text-brand-blue font-semibold hover:text-brand-purple transition-colors underline decoration-2 underline-offset-4"
          >
            Hapus pencarian
          </button>
        </div>
      )}

      {/* SECTION 1: TUGAS MINGGU INI (Pink Theme) */}
      {showTasks && (
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl glass border-2 border-pink-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-brand-blue/90 py-4 px-6 backdrop-blur-sm flex items-center gap-2">
            <Clock className="text-white w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-wide">Tugas Minggu Ini</h2>
          </div>
          
          {filteredTasks.length > 0 ? (
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task, index) => (
                <div 
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="glass-hover p-5 rounded-xl border border-pink-200/60 bg-white/30 cursor-pointer group animate-fade-in-up opacity-0 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:bg-white/60"
                  style={{ animationDelay: `${150 + index * 50}ms` }}
                >
                  <h3 className="text-brand-blue font-bold text-lg mb-2 group-hover:text-brand-purple transition-colors">
                    <HighlightText text={task.subject} highlight={searchQuery} />
                  </h3>
                  <div className="text-slate-600 text-sm space-y-1">
                    <p><span className="font-semibold text-slate-500">Deadline:</span> {task.deadline}</p>
                    <p className="italic text-slate-700 line-clamp-2">
                      "<HighlightText text={task.note} highlight={searchQuery} />"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 italic">
              Tidak ada tugas aktif saat ini.
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: PENGUMUMAN TERBARU*/}
      {showAnnouncements && (
        <div className="rounded-2xl overflow-hidden shadow-xl glass border-2 border-yellow-200 animate-fade-in-up" style={{ animationDelay: showTasks ? '400ms' : '100ms' }}>
          <div className="bg-brand-blue/90 py-4 px-6 backdrop-blur-sm flex items-center gap-2">
            <AlertCircle className="text-white w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-wide">Pengumuman Terbaru</h2>
          </div>

          {filteredAnnouncements.length > 0 ? (
            <div className="p-6 md:p-8 space-y-4">
              {filteredAnnouncements.map((announcement, index) => {
                const isExpanded = expandedAnnouncementId === announcement.id;
                return (
                  <div 
                    key={announcement.id}
                    className={`glass rounded-xl border-l-4 border-l-brand-blue bg-white/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isExpanded ? 'bg-white/70 ring-1 ring-brand-blue/30' : 'hover:bg-white/50'} animate-fade-in-up`}
                    style={{ animationDelay: `${450 + index * 50}ms` }}
                  >
                    {/* Accordion Header */}
                    <button 
                      onClick={() => toggleAnnouncement(announcement.id)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-brand-blue font-bold text-lg leading-tight pr-4">
                          <HighlightText text={announcement.subject} highlight={searchQuery} />
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Calendar size={14} className="text-brand-pink/70" />
                          <span>{announcement.date}</span>
                        </div>
                      </div>
                      
                      <div className={`shrink-0 p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-brand-blue/10 text-brand-blue rotate-180' : 'bg-transparent text-slate-400 hover:bg-slate-100'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    {/* Accordion Body */}
                    <div 
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="h-px w-full bg-linear-to-r from-transparent via-brand-blue/20 to-transparent mb-4"></div>
                         <p className="text-slate-700 text-sm leading-relaxed">
                            <HighlightText text={announcement.content} highlight={searchQuery} />
                         </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 italic">
              Tidak ada pengumuman terbaru.
            </div>
          )}
        </div>
      )}

      {/* MODAL POPUP (Only for Tasks now) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={closeModal}
          ></div>
          <div className="relative glass rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-pink-100/80">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-slate-800 pr-8">
                  {selectedTask.subject}
                </h3>
                <button onClick={closeModal} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} className="text-slate-500" />
                </button>
              </div>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-200 text-pink-700">
                Tugas
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Deadline</p>
                <p className="text-slate-800 font-medium">{selectedTask.deadline}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Catatan</p>
                <p className="text-slate-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-slate-100">
                  {selectedTask.note}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100/50 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default AnnouncementPage;