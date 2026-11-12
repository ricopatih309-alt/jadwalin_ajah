import { useEffect, useState, type FormEvent } from 'react';
import Select, { type SingleValue } from 'react-select';
import { CheckCircle2, FileUp, LoaderCircle, UploadCloud } from 'lucide-react';
import type { Schedule, Student } from '../types/types';

type StudentOption = { value: number; label: string };

const UploadTugasForm = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [taskType, setTaskType] = useState<'Individu' | 'Kelompok'>('Individu');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [groupName, setGroupName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ fileName: string; fileUrl: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        const [schedulesResponse, studentsResponse] = await Promise.all([
          fetch('/api/schedules.php', { signal: controller.signal }),
          fetch('/api/students.php', { signal: controller.signal }),
        ]);
        if (!schedulesResponse.ok || !studentsResponse.ok) {
          throw new Error('Daftar mata kuliah atau mahasiswa gagal dimuat.');
        }

        const [scheduleData, studentData] = await Promise.all([
          schedulesResponse.json() as Promise<Schedule[]>,
          studentsResponse.json() as Promise<Student[]>,
        ]);
        setSchedules(scheduleData);
        setSubjectId(scheduleData[0]?.subject_id ?? '');
        setStudents(studentData.map((student) => ({
          value: Number(student.id),
          label: `${student.name} - ${student.npm}`,
        })));
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === 'AbortError') return;
        setError(requestError instanceof Error ? requestError.message : 'Data formulir gagal dimuat.');
      } finally {
        if (!controller.signal.aborted) setLoadingOptions(false);
      }
    };

    loadOptions();
    return () => controller.abort();
  }, []);

  const handleTypeChange = (nextType: 'Individu' | 'Kelompok') => {
    setTaskType(nextType);
    setStudentId(null);
    setGroupName('');
    setError('');
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess(null);

    if (!subjectId || !file) {
      setError('Pilih mata kuliah dan file tugas terlebih dahulu.');
      return;
    }
    if (taskType === 'Individu' && studentId === null) {
      setError('Pilih nama mahasiswa untuk tugas individu.');
      return;
    }
    if (taskType === 'Kelompok' && !groupName) {
      setError('Pilih kelompok terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.set('subject_id', subjectId);
    formData.set('tipe_tugas', taskType);
    if (taskType === 'Individu') formData.set('mahasiswa_id', String(studentId));
    if (taskType === 'Kelompok') formData.set('nama_kelompok', groupName);
    formData.set('file', file);

    try {
      const response = await fetch('/api/upload_tugas.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json() as { message?: string; file_name?: string; file_url?: string; error?: string };
      if (!response.ok || !result.file_url || !result.file_name) {
        throw new Error(result.error || 'Tugas gagal dikumpulkan.');
      }

      setSuccess({ fileName: result.file_name, fileUrl: result.file_url });
      setFile(null);
      const fileInput = document.getElementById('task-upload-file') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Tugas gagal dikumpulkan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStudent = students.find((student) => student.value === studentId) ?? null;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-20 pt-28">
      <header className="mb-8 border-l-8 border-brand-blue pl-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Pengumpulan</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-dark">Upload Tugas</h1>
        <p className="mt-2 text-sm text-slate-600">Pilih mata kuliah dan pengumpul, lalu unggah file tugas.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-md sm:p-8">
        {loadingOptions ? (
          <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle size={17} className="animate-spin" /> Memuat mata kuliah dan mahasiswa...</div>
        ) : (
          <>
            <label className="block text-sm font-bold text-slate-700">
              Mata Kuliah
              <select
                required
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                disabled={schedules.length === 0}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="" disabled>Pilih mata kuliah</option>
                {schedules.map((schedule) => (
                  <option key={schedule.subject_id} value={schedule.subject_id}>{schedule.subject}</option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="mb-2 text-sm font-bold text-slate-700">Tipe Tugas</legend>
              <div className="grid grid-cols-2 gap-3">
                {(['Individu', 'Kelompok'] as const).map((type) => (
                  <label key={type} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${taskType === type ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <input type="radio" name="tipe_tugas" value={type} checked={taskType === type} onChange={() => handleTypeChange(type)} className="accent-blue-600" />
                    {type}
                  </label>
                ))}
              </div>
            </fieldset>

            {taskType === 'Individu' ? (
              <div>
                <label htmlFor="task-student-select" className="mb-2 block text-sm font-bold text-slate-700">Nama Mahasiswa</label>
                <Select<StudentOption, false>
                  inputId="task-student-select"
                  options={students}
                  value={selectedStudent}
                  onChange={(option: SingleValue<StudentOption>) => setStudentId(option?.value ?? null)}
                  placeholder="Cari nama atau NPM..."
                  noOptionsMessage={() => 'Mahasiswa tidak ditemukan'}
                  isClearable
                  isDisabled={students.length === 0}
                  classNamePrefix="student-select"
                  styles={{
                    control: (base, state) => ({ ...base, minHeight: 48, borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1', boxShadow: state.isFocused ? '0 0 0 2px #dbeafe' : 'none', '&:hover': { borderColor: '#3b82f6' } }),
                    menu: (base) => ({ ...base, zIndex: 30 }),
                  }}
                />
                {students.length === 0 && <p className="mt-2 text-sm text-amber-700">Belum ada data mahasiswa.</p>}
              </div>
            ) : (
              <label className="block text-sm font-bold text-slate-700">
                Nama Kelompok
                <select
                  required
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>Pilih kelompok</option>
                  {Array.from({ length: 10 }, (_, index) => `Kelompok ${index + 1}`).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </label>
            )}

            <label htmlFor="task-upload-file" className="block text-sm font-bold text-slate-700">
              File Tugas
              <span className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition-colors hover:border-brand-blue hover:bg-blue-50/50">
                {file ? <FileUp size={28} className="mb-2 text-brand-blue" /> : <UploadCloud size={28} className="mb-2 text-slate-400" />}
                <span className="font-semibold text-slate-700">{file?.name ?? 'Pilih file untuk diunggah'}</span>
                <span className="mt-1 text-xs font-normal text-slate-500">PDF, Office, TXT, CSV, ZIP, JPG, PNG. Maksimal 20 MB.</span>
              </span>
              <input
                id="task-upload-file"
                required
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.jpg,.jpeg,.png"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {success && (
              <div role="status" className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                <p>Tugas <a href={success.fileUrl} target="_blank" rel="noreferrer" className="font-bold underline">{success.fileName}</a> berhasil dikumpulkan.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !subjectId || (taskType === 'Individu' && students.length === 0)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              {isSubmitting ? 'Mengunggah tugas...' : 'Kumpulkan Tugas'}
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default UploadTugasForm;