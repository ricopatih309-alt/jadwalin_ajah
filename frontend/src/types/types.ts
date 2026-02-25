
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
  hasDropdown?: boolean;
}

export interface ContactInfo {
  label: string;
  value: string;
  href?: string;
}

export interface Task {
  id: number;
  subject: string;
  deadline: string;
  note: string;
  created_at?: string;
}

export interface Announcement {
  id: number;
  subject: string;
  date: string;
  content: string;
  created_at?: string;
}

export interface CalendarEvent {
  id: number;
  category?: string; 
  variant?: 'pink' | 'yellow' | 'blue-solid' | 'blue-outline'; 
  title: string;
  date_range: string;
  sort_date?: string;
  url?: string;
}

export interface CalendarCategory {
  id: number;
  title: string;
  variant: 'pink' | 'yellow' | 'blue-solid' | 'blue-outline';
  icon: 'flag' | 'book' | 'calendar' | 'plus' | 'clipboard' | 'sun';
  isNew?: boolean;
  events: CalendarEvent[];
}

export type StudentStatus = 'Aktif' | 'Cuti' | 'Non-Aktif';

export interface Student {
  npm: string;
  name: string;
  status: StudentStatus;
}


export interface Schedule {
  id: number;
  day: string;
  time: string;
  code: string;
  subject: string;
  room: string;
  lecturer: string;
  sks: number;
}

export interface Materi {
  id: number;
  subject_id: string; 
  meeting: number;   
  title: string;
  url: string;       
}

export interface Subject {
  id: string;         
  name: string;
  lecturer: string;
  code: string;     
  sks: number;
  materialCount?: number; 
  accentColor?: string; 
}
