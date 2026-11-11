import AdminCrudManager, { type ManagerColumn, type ManagerField } from './AdminCrudManager';

const fields: ManagerField[] = [
  { name: 'subject', label: 'Subjek Pengumuman' },
  { name: 'date', label: 'Tanggal' },
  { name: 'content', label: 'Isi Pengumuman', type: 'textarea' },
];
const columns: ManagerColumn[] = [
  { key: 'subject', label: 'Subjek' }, { key: 'date', label: 'Tanggal' }, { key: 'content', label: 'Isi' },
];

const PengumumanManager = () => <AdminCrudManager title="Pengumuman" endpoint="/api/admin/Pengumuman.php" fields={fields} columns={columns} />;
export default PengumumanManager;