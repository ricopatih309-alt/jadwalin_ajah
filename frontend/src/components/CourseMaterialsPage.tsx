import React, { useState, useEffect } from 'react';
import type { Materi, Subject } from '../types/types';
import { Book, FileText, FolderOpen, ArrowLeft, Link2, Search } from 'lucide-react';

const CourseMaterialsPage: React.FC = () => {
  // --- STATE ---
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [materials, setMaterials] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- FETCH DAFTAR MATKUL (ON MOUNT) ---
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/daftar_matkul');
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error("Gagal ambil daftar matkul:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // --- HANDLERS ---
  const handleSelectSubject = async (subject: Subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    setSearchQuery(''); // Reset search saat ganti matkul

    try {
      const res = await fetch(`http://localhost:3001/api/subjects/${subject.id}/materi`);
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      console.error("Gagal ambil materi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setMaterials([]);
    setSearchQuery('');
  };

  // --- VIEW 1: DAFTAR MATA KULIAH ---
  const renderSubjectList = () => (
    <div className="animate-fade-in-up">
       <div className="mb-10 text-center">
         <h1 className="text-4xl font-extrabold text-brand-dark uppercase tracking-tight">
           Daftar <span className="text-brand-blue">Mata Kuliah</span>
         </h1>
         <p className="mt-2 text-slate-600">Pilih mata kuliah untuk mengakses materi pembelajaran.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {subjects.map((subject) => (
           <div 
             key={subject.id}
             className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group"
           >
              <h3 className="text-lg font-bold text-brand-blue mb-1 group-hover:text-brand-purple transition-colors">
                {subject.name}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                 {subject.lecturer}
              </p>
              <button 
                onClick={() => handleSelectSubject(subject)}
                className="mt-auto w-full bg-[#fdc5e7] hover:bg-[#faaad6] text-white font-bold py-3 px-6 rounded-full transition-colors active:scale-95"
              >
                Buka Materi
              </button>
           </div>
         ))}
       </div>
    </div>
  );

  // --- VIEW 2: DETAIL MATERI ---
  const renderSubjectDetail = (subject: Subject) => {
    // Filter materi berdasarkan search bar
    const filteredMaterials = materials.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="animate-fade-in-right">
        <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-brand-blue mb-6 font-semibold transition-colors group">
          <div className="p-2 rounded-full bg-white group-hover:bg-blue-50 shadow-sm border border-slate-100">
             <ArrowLeft size={20} />
          </div>
          Kembali ke Daftar
        </button>
  
        <div className="w-full border border-white/40 rounded-[30px] p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-6">
             <div className="w-20 h-24 rounded-xl bg-blue-500 shadow-lg flex items-center justify-center transform -rotate-3">
                <Book className="text-white w-10 h-10" />
             </div>
             <div className="text-center md:text-left">
               <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-blue-600">{subject.name}</h2>
               <p className="text-slate-600 font-medium">Dosen: <b>{subject.lecturer}</b> | {subject.code} • {subject.sks} SKS</p>
             </div>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 flex items-center gap-3">
            <FolderOpen className="text-yellow-500" size={28} />
            <div className="flex flex-col">
              <span className="text-xl font-bold">{materials.length}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Materi</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
            placeholder="Cari materi pertemuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((materi) => (
            <a 
              key={materi.id}
              href={materi.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-slate-100 hover:border-blue-400 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                 <FileText className="text-red-500" size={24} />
              </div>
              <div className="grow min-w-0">
                <h4 className="font-bold text-sm text-slate-800 truncate">{materi.title}</h4>
                <p className="text-slate-400 text-xs">Pertemuan {materi.meeting}</p>
              </div>
              <Link2 className="text-slate-300 group-hover:text-blue-500" size={18} />
            </a>
          ))}
        </div>
      </div>
    );
  };

  if (loading && subjects.length === 0) return <div className="text-center pt-40">Memuat Data...</div>;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pt-28 pb-20">
      {selectedSubject ? renderSubjectDetail(selectedSubject) : renderSubjectList()}
    </section>
  );
};

export default CourseMaterialsPage