import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const hasValidAdminToken = () => {
  const token = localStorage.getItem('admin_token');
  const payloadPart = token?.split('.')[1];

  if (!payloadPart) return false;

  try {
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const payload = JSON.parse(window.atob(paddedBase64)) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

const ProtectedAdminRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  if (!hasValidAdminToken()) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('adminProfile');
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedAdminRoute;