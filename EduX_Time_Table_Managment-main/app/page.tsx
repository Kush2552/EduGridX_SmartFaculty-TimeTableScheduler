'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveDestination = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.replace('/login');
          return;
        }

        const result = await response.json();
        if (result.user.role === 'admin') {
          router.replace('/dashboard');
        } else {
          router.replace('/timetable');
        }
      } catch {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    resolveDestination();
  }, [router]);

  if (!loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-700">Loading...</p>
    </div>
  );
}

