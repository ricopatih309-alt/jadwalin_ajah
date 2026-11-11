export async function adminFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.assign('/admin/login');
    throw new Error('Sesi admin tidak ditemukan. Silakan login kembali.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, { ...init, headers });
  const result = await response.json().catch(() => null) as { error?: string } | T | null;

  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('adminProfile');
    window.location.assign('/admin/login');
    throw new Error('Sesi admin berakhir. Silakan login kembali.');
  }
  if (!response.ok) {
    const message = result && typeof result === 'object' && 'error' in result
      ? result.error
      : 'Request admin gagal.';
    throw new Error(message || 'Request admin gagal.');
  }

  return result as T;
}