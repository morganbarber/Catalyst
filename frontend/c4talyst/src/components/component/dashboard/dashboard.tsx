import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect, useContext } from "react"
import { ModeToggle } from "../theme-toggle"
import { AuthContext } from '../auth/AuthContext';

interface Notification {
  title: string
  description: string
  href: string
}

export default function Dashboard({children}: {children: React.ReactNode}) {
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <nav className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <span className="text-3xl font-bold">C4TALYST</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <BellIcon className="h-6 w-6" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-center">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium">No new notifications</p>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="hidden w-64 flex-col border-r bg-background p-4 sm:flex">
          <div className="grid gap-2">
            <Link
              href="/dashboard/main"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              prefetch={false}
            >
              <HomeIcon className="h-5 w-5" />
              Main
            </Link>
            <Link
              href="/dashboard/finances"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              prefetch={false}
            >
              <DollarSignIcon className="h-5 w-5" />
              Expenses & Incomes
            </Link>
            <Link
              href="/dashboard/consultant"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              prefetch={false}
            >
              <UsersIcon className="h-5 w-5" />
              Counseling
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              prefetch={false}
            >
              <CreditCardIcon className="h-5 w-5" />
              Debt
            </Link>
            <Link
              href="/dashboard/insurance"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              prefetch={false}
            >
              <ShieldIcon className="h-5 w-5" />
              Insurance
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              prefetch={false}
            >
              <WalletIcon className="h-5 w-5" />
              Budgeting
            </Link>
          </div>
        </nav>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
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


function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}


function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
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


function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
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


function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}


function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
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


function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}