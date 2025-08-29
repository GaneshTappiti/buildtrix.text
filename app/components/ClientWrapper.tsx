"use client"

import { useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientWrapper({ children, fallback }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback || (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
