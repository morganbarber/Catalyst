"use client";

import Dashboard from "@/components/component/dashboard/dashboard";
import { ExpenseTable } from "@/components/component/dashboard/finances/expense-table";
import PrivateRoute from "@/components/component/auth/PrivateRoute";

export default function Page() {
    return (
        <PrivateRoute>
            <Dashboard>
                {
                    <ExpenseTable />
                }
            </Dashboard>
        </PrivateRoute>
    );
}