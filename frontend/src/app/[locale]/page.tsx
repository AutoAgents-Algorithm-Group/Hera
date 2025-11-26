"use client"

import { useSession } from "@/lib/auth/client"

export default function HomePage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Hera!</h1>
      {session?.user && (
        <div>
          <p>Logged in as: {session.user.email}</p>
          <p>Name: {session.user.name || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}


