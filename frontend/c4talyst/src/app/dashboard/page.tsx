"use client";

import { Dashboard } from "@/components/component/dashboard/dashboard";
import { AuthContext } from "@/components/component/auth/AuthContext";
 
export default function Home() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Dashboard/>
      </div>
    </main>
  );
}
