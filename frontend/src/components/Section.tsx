import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="w-full max-w-6xl mx-auto px-4 pt-28 pb-12 min-h-[70vh]">
      <div className="glass rounded-3xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-purple-400 pb-2 inline-block">
          {title}
        </h2>
        <div className="text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;