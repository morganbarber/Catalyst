"use client";

import Dashboard from "@/components/component/dashboard/dashboard";
import { ExpenseTable } from "@/components/component/dashboard/finances/expense-table";
import PrivateRoute from "@/components/component/auth/PrivateRoute";
import { IncomeTable } from "@/components/component/dashboard/finances/income-table";
import { Performance } from "@/components/component/dashboard/finances/performance";

export default function Page() {
    return (
        <PrivateRoute>
            <div style={{ overflowY: 'scroll', scrollbarWidth: 'none' }}>
                <Dashboard>
                    <div style={{ overflowY: 'scroll', scrollbarWidth: 'none' }}>
                        <ExpenseTable/>
                        <div style={{ marginBottom: '4rem' }} />
                        <IncomeTable/>
                        <div style={{ marginBottom: '4rem' }} />
                        <Performance/>
                    </div>
                </Dashboard>
            </div>
            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }
            `}</style>
        </PrivateRoute>
    );
}

