import React, { useState, useEffect } from 'react';
import type { Student } from '../types/types';
import { Search, UserCircle, Frown, ShieldCheck, ShieldAlert } from 'lucide-react';


const MembersPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

// --- 2. Fetch Data dari SQL (Backend) ---
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Sesuaikan port 3001 dengan port backend kamu
        const res = await fetch('http://localhost:3001/api/students'); 
        const data: Student[] = await res.json();

        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Gagal ambil data mahasiswa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

 // --- 3. Logika Search Real-time ---
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = students.filter(student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.npm.includes(lowerQuery)
    );
    setFilteredStudents(results);
  }, [searchQuery, students]);

  // --- 4. Tampilan Loading ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <section id="anggota" className="w-full max-w-5xl mx-auto px-4 pt-28 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in-down">
        <div>
           <h1 className="text-4xl font-extrabold text-brand-dark uppercase tracking-tight drop-shadow-sm border-l-8 border-brand-purple pl-4">
            Data Anggota
          </h1>
          <p className="mt-2 text-slate-600 pl-6 text-sm md:text-base font-medium">
            Daftar lengkap mahasiswa aktif kelas 2KA19.
          </p>
        </div>

        {/* Floating Search Bar */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-purple transition-colors duration-300" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-6 py-3.5 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full text-slate-800 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-purple/20 focus:border-brand-purple/50 transition-all duration-300 ease-out"
            placeholder="Cari Nama atau NPM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Glass Data Container */}
      <div className="w-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-linear-to-r from-brand-blue/10 to-brand-purple/10 border-b border-white/50 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <div className="col-span-3 md:col-span-2">NPM</div>
          <div className="col-span-6 md:col-span-8">Nama Lengkap</div>
          <div className="col-span-3 md:col-span-2 text-center">Status</div>
        </div>

        {/* Scrollable List */}
        <div className="max-h-150 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student,) => (
              <div 
                key={student.npm}
                className="grid grid-cols-12 gap-4 items-center px-4 py-4 rounded-xl transition-all duration-200 hover:bg-white/60 hover:shadow-md hover:scale-[1.01] group cursor-default border border-transparent hover:border-white/50"
              >
                {/* NPM Column */}
                <div className="col-span-3 md:col-span-2 font-mono font-semibold text-slate-600 group-hover:text-brand-blue transition-colors">
                  {student.npm}
                </div>

                {/* Name Column */}
                <div className="col-span-6 md:col-span-8 font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center text-brand-purple shrink-0">
                    <UserCircle size={18} />
                  </div>
                  <span className="truncate group-hover:text-brand-purple transition-colors">{student.name}</span>
                </div>

                {/* Status Column */}
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <span 
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide shadow-sm border ${
                      student.status === 'Aktif' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-pink-100 text-pink-700 border-pink-200'
                    }`}
                  >
                    {student.status === 'Aktif' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {student.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Frown size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-1">Data tidak ditemukan</h3>
              <p className="text-slate-500 max-w-xs">
                Tidak ada mahasiswa dengan nama atau NPM "{searchQuery}".
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-sm font-semibold text-brand-blue hover:text-brand-purple underline underline-offset-4 transition-colors"
              >
                Tampilkan semua data
              </button>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50/50 border-t border-white/50 text-right">
          <p className="text-xs text-slate-400 font-medium">
            Total Mahasiswa: <span className="text-slate-700 font-bold">{filteredStudents.length}</span>
          </p>
        </div>

      </div>
    </section>
  );
};

export default MembersPage;