import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminFetch } from '../adminApi';

export type ManagerField = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'url' | 'textarea' | 'select' | 'subject';
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export type ManagerColumn = {
  key: string;
  label: string;
  link?: boolean;
};

type AdminRecord = Record<string, unknown> & { id?: number | string };
type SubjectOption = { subject_id: string; subject: string };

type AdminCrudManagerProps = {
  title: string;
  endpoint: string;
  fields: ManagerField[];
  columns: ManagerColumn[];
  filterBySubject?: boolean;
};

const AdminCrudManager = ({ title, endpoint, fields, columns, filterBySubject = false }: AdminCrudManagerProps) => {
  const needsSubjects = fields.some((field) => field.type === 'subject');
  const [rows, setRows] = useState<AdminRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [subjectsLoaded, setSubjectsLoaded] = useState(!needsSubjects);
  const [scheduleError, setScheduleError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!needsSubjects) return;
    let active = true;

    const loadSubjects = async () => {
      try {
        const data = await adminFetch<SubjectOption[]>('/api/admin/Jadwal_Kuliah.php');
        if (!active) return;
        setSubjects(data);
        setSelectedSubjectId((current) => current || data[0]?.subject_id || '');
        setScheduleError('');
      } catch (requestError) {
        if (!active) return;
        setScheduleError(requestError instanceof Error ? requestError.message : 'Daftar mata kuliah gagal dimuat.');
      } finally {
        if (active) setSubjectsLoaded(true);
      }
    };

    loadSubjects();
    return () => { active = false; };
  }, [needsSubjects]);

  const filteredEndpoint = filterBySubject && selectedSubjectId
    ? `${endpoint}?subject_id=${encodeURIComponent(selectedSubjectId)}`
    : endpoint;

  useEffect(() => {
    if (!subjectsLoaded) return;
    if (filterBySubject && !selectedSubjectId) {
      setRows([]);
      setLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError('');

    adminFetch<AdminRecord[]>(filteredEndpoint, { signal: controller.signal })
      .then((data) => { if (active) setRows(data); })
      .catch((requestError) => {
        if (active && !(requestError instanceof Error && requestError.name === 'AbortError')) {
          setError(requestError instanceof Error ? requestError.message : 'Data gagal dimuat.');
        }
      })
      .finally(() => { if (active) setLoading(false); });

    return () => {
      active = false;
      controller.abort();
    };
  }, [filteredEndpoint, filterBySubject, selectedSubjectId, subjectsLoaded, refreshKey]);

  const openForm = (row?: AdminRecord) => {
    const initialValues = Object.fromEntries(fields.map((field) => [
      field.name,
      row?.[field.name] !== undefined
        ? String(row[field.name])
        : field.defaultValue ?? (field.type === 'subject' ? selectedSubjectId : ''),
    ]));
    setFormValues(initialValues);
    setEditingId(row?.id ?? null);
    setIsFormOpen(true);
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: Record<string, unknown> = Object.fromEntries(fields.map((field) => [field.name, formValues[field.name] ?? '']));
      if (editingId !== null) payload.id = editingId;
      await adminFetch(endpoint, {
        method: editingId === null ? 'POST' : 'PUT',
        body: JSON.stringify(payload),
      });
      setIsFormOpen(false);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Data gagal disimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: AdminRecord) => {
    if (row.id === undefined || !window.confirm(`Hapus data ini dari ${title}?`)) return;
    setError('');
    try {
      await adminFetch(`${endpoint}?id=${encodeURIComponent(String(row.id))}`, { method: 'DELETE' });
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Data gagal dihapus.');
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{rows.length} data</p>
        <button
          type="button"
          onClick={() => openForm()}
          disabled={needsSubjects && (!subjectsLoaded || subjects.length === 0)}
          className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} /> Tambah {title}
        </button>
      </div>

      {needsSubjects && scheduleError && <p role="alert" className="mb-4 text-sm text-red-700">{scheduleError}</p>}
      {error && !isFormOpen && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => <th key={column.key} scope="col" className="border-b border-slate-200 px-4 py-3 font-bold">{column.label}</th>)}
              <th scope="col" className="border-b border-slate-200 px-4 py-3 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">Memuat data...</td></tr>
            ) : error && !rows.length ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-red-700">Data gagal dimuat.</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">Belum ada data.</td></tr>
            ) : rows.map((row, index) => (
              <tr key={String(row.id ?? index)} className="align-top hover:bg-slate-50/70">
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={column.key} className="max-w-sm px-4 py-3 text-slate-700">
                      {column.link && typeof value === 'string' && value.startsWith('http')
                        ? <a href={value} target="_blank" rel="noreferrer" className="font-semibold text-brand-blue hover:underline">Buka tautan</a>
                        : String(value ?? '-')}
                    </td>
                  );
                })}
                <td className="whitespace-nowrap px-4 py-3">
                  <button type="button" title="Edit" aria-label="Edit" onClick={() => openForm(row)} className="mr-1 rounded p-2 text-slate-600 hover:bg-blue-50 hover:text-brand-blue"><Pencil size={16} /></button>
                  <button type="button" title="Hapus" aria-label="Hapus" onClick={() => void handleDelete(row)} className="rounded p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filterBySubject && (
        <div className="mt-4 max-w-sm">
          <label htmlFor={`${title}-subject-filter`} className="mb-1.5 block text-sm font-semibold text-slate-700">Filter Mata Kuliah</label>
          <select
            id={`${title}-subject-filter`}
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(event.target.value)}
            disabled={!subjectsLoaded || subjects.length === 0}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          >
            {subjects.map((subject) => <option key={subject.subject_id} value={subject.subject_id}>{subject.subject}</option>)}
          </select>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <h2 className="text-lg font-bold">{editingId === null ? `Tambah ${title}` : `Edit ${title}`}</h2>
              <button type="button" aria-label="Tutup form" onClick={() => setIsFormOpen(false)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={`block text-sm font-semibold text-slate-700 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                  {field.label}
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required !== false}
                      rows={4}
                      value={formValues[field.name] ?? ''}
                      onChange={(event) => setFormValues((values) => ({ ...values, [field.name]: event.target.value }))}
                      className="mt-1.5 block w-full resize-y rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                    />
                  ) : field.type === 'select' || field.type === 'subject' ? (
                    <select
                      required={field.required !== false}
                      value={formValues[field.name] ?? ''}
                      disabled={field.type === 'subject' && (!subjectsLoaded || subjects.length === 0)}
                      onChange={(event) => setFormValues((values) => ({ ...values, [field.name]: event.target.value }))}
                      className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                    >
                      <option value="" disabled>Pilih {field.label.toLowerCase()}</option>
                      {(field.type === 'subject'
                        ? subjects.map((subject) => ({ value: subject.subject_id, label: subject.subject }))
                        : field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required={field.required !== false}
                      type={field.type ?? 'text'}
                      min={field.type === 'number' ? 0 : undefined}
                      placeholder={field.placeholder}
                      value={formValues[field.name] ?? ''}
                      onChange={(event) => setFormValues((values) => ({ ...values, [field.name]: event.target.value }))}
                      className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                    />
                  )}
                </label>
              ))}
              {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" disabled={saving} className="rounded-md bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCrudManager;