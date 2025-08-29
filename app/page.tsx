"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to workspace page immediately
    router.replace("/workspace");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-400 border-t-transparent"></div>
        <p className="text-gray-300 text-sm">Redirecting to workspace...</p>
      </div>
    </div>
  );
}
