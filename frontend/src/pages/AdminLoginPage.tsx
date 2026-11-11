import { useState, type FormEvent } from 'react';
import { ArrowLeft, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginResponse {
  token?: string;
  admin?: { id: number; username: string; name: string };
  error?: string;
}

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json() as LoginResponse;

      if (!response.ok || !result.token || !result.admin) {
        throw new Error(result.error || 'Login gagal. Periksa kembali kredensial Anda.');
      }

      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('adminProfile', JSON.stringify(result.admin));
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-slate-900">
      <div className="absolute inset-x-0 top-0 h-2 bg-brand-blue" />
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-blue">
          <ArrowLeft size={17} /> Kembali ke website
        </Link>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white/90 shadow-xl backdrop-blur">
          <div className="border-b border-slate-200 px-7 py-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
              <ShieldCheck size={23} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">Jadwalin Ajah</p>
            <h1 className="mt-2 text-2xl font-bold">Admin login</h1>
            <p className="mt-1 text-sm text-slate-500">Masuk untuk mengakses panel pengelolaan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
            <label className="block text-sm font-semibold text-slate-700">
              Username
              <input
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
              />
            </label>
            {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <KeyRound size={17} />}
              {isSubmitting ? 'Memeriksa...' : 'Masuk ke dashboard'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminLoginPage;