import AdminCrudManager, { type ManagerColumn, type ManagerField } from './AdminCrudManager';

const fields: ManagerField[] = [
  { name: 'subject_id', label: 'ID Mata Kuliah' },
  { name: 'subject', label: 'Mata Kuliah' },
  { name: 'day', label: 'Hari', type: 'select', options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((value) => ({ label: value, value })) },
  { name: 'time', label: 'Waktu', placeholder: '07:30 - 09:30' },
  { name: 'code', label: 'Kode' },
  { name: 'room', label: 'Ruang' },
  { name: 'lecturer', label: 'Dosen' },
  { name: 'sks', label: 'SKS', type: 'number' },
];

const columns: ManagerColumn[] = [
  { key: 'subject_id', label: 'ID' }, { key: 'subject', label: 'Mata Kuliah' }, { key: 'day', label: 'Hari' },
  { key: 'time', label: 'Waktu' }, { key: 'code', label: 'Kode' }, { key: 'lecturer', label: 'Dosen' },
];

const JadwalKuliahManager = () => <AdminCrudManager title="Jadwal Kuliah" endpoint="/api/admin/Jadwal_Kuliah.php" fields={fields} columns={columns} />;
export default JadwalKuliahManager;