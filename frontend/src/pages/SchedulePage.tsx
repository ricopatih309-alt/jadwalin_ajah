import React, { useMemo, useEffect, useState } from 'react';
import type { Schedule } from '../types/types';
import { BookOpen, User, MapPin, Clock } from 'lucide-react';

const SchedulePage: React.FC = () => {
const [schedules, setSchedules] = useState<Schedule[]>([]);

useEffect(() => {
  fetch('http://localhost:3001/api/schedules')
    .then(res => res.json())
    .then(data => setSchedules(data))
    .catch(err => console.error(err));
}, []);


  const dayOrder: { [key: string]: number } = {
    "Senin": 1,
    "Selasa": 2,
    "Rabu": 3,
    "Kamis": 4,
    "Jumat": 5,
    "Sabtu": 6,
    "Minggu": 7
  };

  // Logic: Sort Data by Day then Time
 const sortedSchedules = useMemo(() => {
  return [...schedules].sort((a, b) => {
    const dayDiff = (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99);
    if (dayDiff !== 0) return dayDiff;

    const timeA = a.time.split('-')[0].trim();
    const timeB = b.time.split('-')[0].trim();
    return timeA.localeCompare(timeB);
  });
}, [schedules]);


  // UI: Get Badge Color based on Day
  const getDayBadgeStyle = (day: string) => {
    switch(day) {
      case "Senin": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Selasa": return "bg-pink-100 text-pink-700 border-pink-200";
      case "Rabu": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Kamis": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Jumat": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Sabtu": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <section id="jadwal" className="w-full max-w-6xl mx-auto px-4 pt-28 pb-20">
      
      {/* Header */}
      <div className="mb-10 text-center animate-fade-in-down">
         <h1 className="text-4xl font-extrabold text-slate-800 uppercase tracking-tight mb-3">
           Jadwal <span className="text-brand-blue">Perkuliahan</span>
         </h1>
         <p className="text-slate-600 max-w-2xl mx-auto">
           Semester Ganjil 2025/2026. Pastikan Anda hadir tepat waktu 15 menit sebelum kelas dimulai.
         </p>
      </div>

      {/* Glass Table Container */}
      <div className="w-full overflow-hidden rounded-3xl shadow-2xl animate-fade-in-up border border-white/40" 
           style={{ 
             background: 'rgba(255, 255, 255, 0.3)', 
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             animationDelay: '100ms'
           }}>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-800px border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/30 bg-white/40 text-left">
                <th className="py-6 px-6 text-sm font-bold text-slate-800 tracking-wider uppercase w-32">Hari</th>
                <th className="py-6 px-6 text-sm font-bold text-slate-800 tracking-wider uppercase w-48">Waktu</th>
                <th className="py-6 px-6 text-sm font-bold text-slate-800 tracking-wider uppercase">Mata Kuliah</th>
                <th className="py-6 px-6 text-sm font-bold text-slate-800 tracking-wider uppercase w-48">Ruang</th>
                <th className="py-6 px-6 text-sm font-bold text-slate-800 tracking-wider uppercase w-64">Dosen</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {sortedSchedules.map((item) => (
                <tr 
                  key={item.id} 
                  className="group transition-all duration-300 hover:bg-white/40 border-b border-white/10 last:border-0"
                >
                  {/* Column: Day */}
                  <td className="py-5 px-6 align-top">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${getDayBadgeStyle(item.day)}`}>
                      {item.day}
                    </span>
                  </td>

                  {/* Column: Time */}
                  <td className="py-5 px-6 align-top">
                    <div className="flex items-center gap-2 text-slate-700 font-medium bg-white/30 px-3 py-1.5 rounded-lg w-fit border border-white/40 group-hover:border-white/60 transition-colors">
                      <Clock size={14} className="text-slate-500" />
                      {item.time}
                    </div>
                  </td>

                  {/* Column: Subject */}
                  <td className="py-5 px-6 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-slate-800 group-hover:text-brand-blue transition-colors duration-200">
                        {item.subject}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <BookOpen size={12} />
                        <span className="uppercase tracking-wider">KODE: {item.code}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{item.sks} SKS</span>
                      </div>
                    </div>
                  </td>

                  {/* Column: Room */}
                  <td className="py-5 px-6 align-top">
                    <div className="flex items-center gap-2 text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                       <MapPin size={16} className="text-brand-pink opacity-80" />
                       {item.room}
                    </div>
                  </td>

                  {/* Column: Lecturer */}
                  <td className="py-5 px-6 align-top">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-colors">
                        <User size={16} />
                      </div>
                      <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">
                        {item.lecturer}
                      </span>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 bg-white/20 border-t border-white/30 flex justify-between items-center text-xs text-slate-500 font-medium">
           <p>* Jadwal dapat berubah sewaktu-waktu.</p>
           <p>Total SKS: {sortedSchedules.reduce((acc, curr) => acc + curr.sks, 0)}</p>
        </div>

      </div>
    </section>
  );
};

export default SchedulePage;