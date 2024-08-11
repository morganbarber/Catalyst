"use client"

import Dashboard from "@/components/component/dashboard/dashboard"
import PrivateRoute from "@/components/component/auth/PrivateRoute"

export default function Home() {

    return (
        <PrivateRoute>
            <Dashboard>
                <b>To get started, select a page from the sidebar.</b>
            </Dashboard>
        </PrivateRoute>
    )
}