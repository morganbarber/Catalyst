"use client"

import Sidebar from "../sidebar"
import PrivateRoute from "../auth/PrivateRoute"

export function Dashboard() {
  return (
    <PrivateRoute>
      <Sidebar>
      </Sidebar>
    </PrivateRoute>
  )
}