import AdminCrudManager, { type ManagerColumn, type ManagerField } from './AdminCrudManager';

const fields: ManagerField[] = [
  { name: 'subject_id', label: 'Mata Kuliah', type: 'subject' },
  { name: 'deadline', label: 'Deadline' },
  { name: 'note', label: 'Catatan', type: 'textarea' },
];
const columns: ManagerColumn[] = [
  { key: 'subject', label: 'Mata Kuliah' }, { key: 'deadline', label: 'Deadline' }, { key: 'note', label: 'Catatan' },
];

const TugasManager = () => <AdminCrudManager title="Tugas" endpoint="/api/admin/Tugas.php" fields={fields} columns={columns} />;
export default TugasManager;