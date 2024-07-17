"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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