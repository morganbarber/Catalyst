"use client";

import Investing from "@/components/component/dashboard/investing/investing";
import PrivateRoute from "@/components/component/auth/PrivateRoute";
import Dashboard from "@/components/component/dashboard/dashboard";

export default function InvestingPage() {
  return (
    <PrivateRoute>
        <Dashboard>
            <Investing />
        </Dashboard>
    </PrivateRoute>
  )
}