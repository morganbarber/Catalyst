"use client"

import PrivateRoute from "@/components/component/auth/PrivateRoute";
import { Insurance } from "@/components/component/dashboard/insurance/insurance";
import Dashboard from "@/components/component/dashboard/dashboard";

export default function Home() {
    return (
        <PrivateRoute>
            <Dashboard>
                <Insurance />
            </Dashboard>
        </PrivateRoute>
    )
}