"use client"

import Dashboard from "@/components/component/dashboard/dashboard"
import PrivateRoute from "@/components/component/auth/PrivateRoute"

export default function Home() {

    return (
        <PrivateRoute>
            <Dashboard>
                a
            </Dashboard>
        </PrivateRoute>
    )
}