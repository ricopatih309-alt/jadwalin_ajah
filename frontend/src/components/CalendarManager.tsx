import AdminCrudManager, { type ManagerColumn, type ManagerField } from './AdminCrudManager';

const fields: ManagerField[] = [
  { name: 'category', label: 'Kategori' },
  { name: 'variant', label: 'Varian Warna', type: 'select', options: ['pink', 'yellow', 'blue-solid', 'blue-outline'].map((value) => ({ label: value, value })) },
  { name: 'title', label: 'Judul Agenda' },
  { name: 'date_range', label: 'Rentang Tanggal' },
  { name: 'sort_date', label: 'Tanggal Pengurutan', type: 'date' },
  { name: 'url', label: 'URL', type: 'url', required: false },
];
const columns: ManagerColumn[] = [
  { key: 'title', label: 'Agenda' }, { key: 'category', label: 'Kategori' },
  { key: 'date_range', label: 'Periode' }, { key: 'sort_date', label: 'Tanggal' },
];

const CalendarManager = () => <AdminCrudManager title="Kalender Akademik" endpoint="/api/admin/calendar.php" fields={fields} columns={columns} />;
export default CalendarManager;