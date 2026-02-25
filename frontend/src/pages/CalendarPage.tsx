import React, { useEffect, useState } from 'react';
import type { CalendarEvent } from '../types/types';
import { Clock} from 'lucide-react';

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'pink':
      return {
        badgeBg: 'bg-pink-100/90',
        badgeText: 'text-pink-600',
        pillBg: 'bg-pink-50/80',
        pillText: 'text-pink-600',
        border: 'border-pink-200 hover:border-pink-300'
      };
    case 'yellow':
      return {
        badgeBg: 'bg-amber-100/90',
        badgeText: 'text-amber-600',
        pillBg: 'bg-amber-50/80',
        pillText: 'text-amber-700',
        border: 'border-amber-200 hover:border-amber-300'
      };
    case 'blue-solid':
      return {
        badgeBg: 'bg-blue-100/90',
        badgeText: 'text-blue-600',
        pillBg: 'bg-blue-50/80',
        pillText: 'text-blue-600',
        border: 'border-blue-200 hover:border-blue-300'
      };
    case 'blue-outline':
      return {
        badgeBg: 'bg-slate-100/90',
        badgeText: 'text-slate-600',
        pillBg: 'bg-slate-50/80',
        pillText: 'text-slate-600',
        border: 'border-slate-200 hover:border-slate-300'
      };
    default:
      return {
        badgeBg: 'bg-gray-100/90',
        badgeText: 'text-gray-600',
        pillBg: 'bg-gray-50/80',
        pillText: 'text-gray-600',
        border: 'border-gray-200'
      };
  }
};

const getDateParts = (dateString?: string) => {
  if (!dateString) return { month: '???', day: '?' };
  const date = new Date(dateString);
  const month = date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  return { month, day };
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/calendar');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Gagal ambil agenda:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  if (loading) return <div className="text-center pt-40">Memuat Agenda...</div>;

  return (
    <section id="kalender" className="w-full max-w-4xl mx-auto px-4 pt-28 pb-20">
      
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
          Agenda <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500">Akademik</span>
        </h1>
        <p className="text-slate-600 text-lg font-medium max-w-xl mx-auto">
          Lini masa kegiatan akademik semester ganjil 2025/2026.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative space-y-6">
        
        {/* Vertical Line */}
        <div className="absolute left-14 md:left-18 top-8 bottom-8 w-px bg-linear-to-b from-transparent via-slate-300 to-transparent hidden sm:block"></div>

        {events.map((event, index) => {
          const styles = getVariantStyles(event.variant || 'blue-outline');
          const { month, day } = getDateParts(event.sort_date as unknown as string);

        return (
          <div 
              key={index}
              className="relative flex items-center gap-4 sm:gap-8 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
          >
              
            {/* Date Badge (Left) */}
            <div className={`relative z-10 shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ${styles.badgeBg} flex flex-col items-center justify-center shadow-sm border border-white/50 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300`}>
              <span className={`text-sm font-bold tracking-widest uppercase ${styles.badgeText} opacity-80`}>{month}</span>
              <span className={`text-4xl sm:text-5xl font-black ${styles.badgeText} leading-none mt-1`}>{day}</span>
            </div>

              {/* Connector Dot*/}
              {/* <div className={`absolute left-14 md:left-18 w-3 h-3 rounded-full bg-white border-4 border-slate-200 hidden sm:block z-20 group-hover:border-purple-400 group-hover:scale-125 transition-all duration-300 transform -translate-x-1/2`}></div> */}

            {/* Event Card */}
            <a 
              href={event.url || '#'}
              target="_blank"        // Buka di tab baru
              rel="noopener noreferrer"
              className={`flex-1 glass rounded-2xl p-5 sm:p-6 ${styles.border} hover:scale-[1.02] transition-all`}
            >
                         
              {/* Header: Tag & Date Range */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${styles.pillBg} ${styles.pillText}`}>
                  {event.category}
                </span>
                <div className="flex items-center text-slate-500 text-xs">
                  <Clock size={14} className="mr-1" />{event.date_range}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-800">{event.title}</h3>

                {/* Optional Decorative Arrow */}
                {/* <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transform -translate-x-2.5 group-hover:translate-x-0 transition-all duration-300 text-slate-300">
                  <ArrowRight size={20} />
                </div> */}
            </a>
            </div>
          );
        })}

        {/* End Indicator */}
        <div className="flex justify-center pt-8 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
           <div className="px-4 py-2 bg-slate-100/60 glass rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
             Akhir Semester
           </div>
        </div>

      </div>

    </section>
  );
};

export default CalendarPage;