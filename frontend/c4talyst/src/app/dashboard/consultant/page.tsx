"use client"

import { Chat } from "@/components/component/dashboard/consultant/chat"
import PrivateRoute from "@/components/component/auth/PrivateRoute"
import Dashboard from "@/components/component/dashboard/dashboard"

export default function Home() {
    return (
        <PrivateRoute>
            <Dashboard>
                <Chat></Chat>
            </Dashboard>
        </PrivateRoute>
    )
}