"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import "../auth/PrivateRoute"
import PrivateRoute from "../auth/PrivateRoute"

export function Dashboard() {
  return (
    <PrivateRoute>
    <div className="flex flex-col h-screen w-full">
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] bg-background">
        <aside className="border-r bg-muted/40 px-4 py-6">
          <div className="flex h-full max-h-screen flex-col gap-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <CogIcon className="h-6 w-6" />
              <span className="sr-only">C4TALYST</span>
            </Link>
            <nav className="flex-1 space-y-2 overflow-auto">
              <div className="space-y-1">
                <h4 className="px-2 text-xs font-medium text-muted-foreground">Manage</h4>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <WalletIcon className="h-5 w-5" />
                  Budget
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <ShieldIcon className="h-5 w-5" />
                  Insurance
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <PiggyBankIcon className="h-5 w-5" />
                  Savings
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <DollarSignIcon className="h-5 w-5" />
                  Income
                </Link>
              </div>
              <div className="space-y-1">
                <h4 className="px-2 text-xs font-medium text-muted-foreground">Insights</h4>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <BarChartIcon className="h-5 w-5" />
                  Analytics
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <PieChartIcon className="h-5 w-5" />
                  Reporting
                </Link>
              </div>
            </nav>
            <div className="space-y-1">
              <h4 className="px-2 text-xs font-medium text-muted-foreground">Settings</h4>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <SettingsIcon className="h-5 w-5" />
                Preferences
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <LogOutIcon className="h-5 w-5" />
                Logout
              </Link>
            </div>
          </div>
        </aside>
        <div className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm md:h-16">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <CogIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">C4TALYST</span>
            </Link>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <BellIcon className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-medium">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <DollarSignIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">New Expense</p>
                        <p className="text-sm text-muted-foreground">You have a new expense of $50 for groceries.</p>
                      </div>
                      <div className="opacity-0 transition-opacity group-hover:opacity-100">
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <PiggyBankIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Savings Goal Reached</p>
                        <p className="text-sm text-muted-foreground">You've reached your savings goal of $5,000!</p>
                      </div>
                      <div className="opacity-0 transition-opacity group-hover:opacity-100">
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <ShieldIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Insurance Renewal</p>
                        <p className="text-sm text-muted-foreground">
                          Your car insurance is up for renewal next month.
                        </p>
                      </div>
                      <div className="opacity-0 transition-opacity group-hover:opacity-100">
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <SettingsIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Settings</p>
                        <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
                      </div>
                      <div className="opacity-0 transition-opacity group-hover:opacity-100">
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img src="/placeholder.svg" width={36} height={36} alt="User avatar" className="rounded-full" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-medium">Jared Palmer</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 lg:px-12 lg:py-12 overflow-y-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Budget</CardTitle>
                  <CardDescription>Track your monthly expenses and stay on top of your budget.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">$2,500</p>
                      <p className="text-sm text-muted-foreground">Spent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$4,000</p>
                      <p className="text-sm text-muted-foreground">Budget</p>
                    </div>
                  </div>
                  <Progress value={62.5} aria-label="Budget progress" />
                </CardContent>
                <CardFooter>
                  <Button>Manage Budget</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Insurance</CardTitle>
                  <CardDescription>Review your insurance policies and make sure you're covered.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">$125</p>
                      <p className="text-sm text-muted-foreground">Monthly</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Policies</p>
                    </div>
                  </div>
                  <Progress value={80} aria-label="Insurance progress" />
                </CardContent>
                <CardFooter>
                  <Button>Manage Insurance</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Savings</CardTitle>
                  <CardDescription>Track your savings goals and monitor your progress.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">$15,000</p>
                      <p className="text-sm text-muted-foreground">Saved</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$20,000</p>
                      <p className="text-sm text-muted-foreground">Goal</p>
                    </div>
                  </div>
                  <Progress value={75} aria-label="Savings progress" />
                </CardContent>
                <CardFooter>
                  <Button>Manage Savings</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Income</CardTitle>
                  <CardDescription>Track your income sources and monitor your cash flow.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">$6,500</p>
                      <p className="text-sm text-muted-foreground">Monthly</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">Sources</p>
                    </div>
                  </div>
                  <Progress value={90} aria-label="Income progress" />
                </CardContent>
                <CardFooter>
                  <Button>Manage Income</Button>
                </CardFooter>
              </Card>
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Get insights into your financial data and make informed decisions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BarChartIcon className="h-8 w-8 text-primary" />
                      <p className="text-2xl font-bold">$25,000</p>
                      <p className="text-sm text-muted-foreground">Total Income</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PieChartIcon className="h-8 w-8 text-accent" />
                      <p className="text-2xl font-bold">$18,000</p>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <TrendingUpIcon className="h-8 w-8 text-success" />
                      <p className="text-2xl font-bold">+12%</p>
                      <p className="text-sm text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  </PrivateRoute>
  )
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}


function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}


function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function CogIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 2v2" />
      <path d="M12 22v-2" />
      <path d="m17 20.66-1-1.73" />
      <path d="M11 10.27 7 3.34" />
      <path d="m20.66 17-1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <path d="M14 12h8" />
      <path d="M2 12h2" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m17 3.34-1 1.73" />
      <path d="m11 13.73-4 6.93" />
    </svg>
  )
}


function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}


function PieChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}


function PiggyBankIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h0" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function ShieldIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}


function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}


function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
