"use client";

import PrivateRoute from "@/components/component/auth/PrivateRoute";
import { Budget } from "@/components/component/dashboard/budget/budget";
import Dashboard from "@/components/component/dashboard/dashboard";

export default function BudgetPage() {
  return (
    <PrivateRoute>
        <Dashboard>
            <Budget>
            </Budget>
        </Dashboard>
    </PrivateRoute>
  )
}