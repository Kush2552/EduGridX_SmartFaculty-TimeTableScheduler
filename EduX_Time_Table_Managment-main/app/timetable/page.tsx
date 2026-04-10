'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import GlobalTimetablePreview from '@/components/GlobalTimetablePreview';
import { Button } from '@/components/ui/button';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

export default function TimetablePage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.replace('/login');
          return;
        }

        const result = await response.json();
        setUser(result.user);
      } catch {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      logout();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-700">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Timetable Viewer</h1>
            <p className="text-xs text-slate-600">
              Signed in as {user.name || user.username} ({user.role})
            </p>
          </div>
          <div className="flex gap-2">
            {user.role === 'admin' && (
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Go To Dashboard
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <GlobalTimetablePreview />
    </div>
  );
}
