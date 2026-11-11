import AdminCrudManager, { type ManagerColumn, type ManagerField } from './AdminCrudManager';

const fields: ManagerField[] = [
  { name: 'subject_id', label: 'Mata Kuliah', type: 'subject' },
  { name: 'meeting', label: 'Pertemuan', type: 'number' },
  { name: 'title', label: 'Judul Materi' },
  { name: 'url', label: 'URL Materi', type: 'url' },
];
const columns: ManagerColumn[] = [
  { key: 'subject', label: 'Mata Kuliah' }, { key: 'meeting', label: 'Pertemuan' },
  { key: 'title', label: 'Judul Materi' }, { key: 'url', label: 'URL', link: true },
];

const MateriKuliahManager = () => <AdminCrudManager title="Materi Kuliah" endpoint="/api/admin/Materi_Kuliah.php" fields={fields} columns={columns} filterBySubject />;
export default MateriKuliahManager;