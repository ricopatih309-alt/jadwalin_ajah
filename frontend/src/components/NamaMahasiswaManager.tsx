import AdminCrudManager, { type ManagerColumn, type ManagerField } from './AdminCrudManager';

const fields: ManagerField[] = [
  { name: 'npm', label: 'NPM' },
  { name: 'name', label: 'Nama Mahasiswa' },
  { name: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Cuti', 'Non-Aktif'].map((value) => ({ label: value, value })) },
];
const columns: ManagerColumn[] = [
  { key: 'npm', label: 'NPM' }, { key: 'name', label: 'Nama' }, { key: 'status', label: 'Status' },
];

const NamaMahasiswaManager = () => <AdminCrudManager title="Nama Mahasiswa" endpoint="/api/admin/Nama_Mahasiswa.php" fields={fields} columns={columns} />;
export default NamaMahasiswaManager;