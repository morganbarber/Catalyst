import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { redirect } from "next/navigation"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <CogIcon className="h-6 w-6" />
          <span className="sr-only">C4TALYST</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-6 lg:grid lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manage Your Finances with C4TALYST
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your financial life with our all-in-one app for tax preparation, investing, budgeting,
                    and savings goal creation.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Download App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <CurrencyIcon className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-bold">Tax Preparation</h3>
                <p className="text-center text-muted-foreground">
                  Effortlessly file your taxes with our intuitive tax preparation tools.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <ImportIcon className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-bold">Investing</h3>
                <p className="text-center text-muted-foreground">
                  Grow your wealth with our powerful investment tracking and analysis features.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <PocketIcon className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-bold">Budgeting</h3>
                <p className="text-center text-muted-foreground">
                  Take control of your spending with our intuitive budgeting tools.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <SaveIcon className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-bold">Savings Goals</h3>
                <p className="text-center text-muted-foreground">
                  Achieve your financial goals with our savings goal tracking and planning features.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Pricing</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that best fits your needs.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Card className="p-6 space-y-4 border rounded-lg shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Basic</h3>
                  <p className="text-4xl font-bold">$FREE/mo</p>
                  <p className="text-muted-foreground">Ideal for individuals</p>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Tax Preparation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Budgeting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Savings Goals
                  </li>
                  <li className="flex items-center gap-2">
                    <XIcon className="w-5 h-5 text-muted-foreground" />
                    Investing
                  </li>
                </ul>
                <Button className="w-full" onClick={redirect('/signup')}>Get Started</Button>
              </Card>
              <Card className="p-6 space-y-4 border rounded-lg shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Premium</h3>
                  <p className="text-4xl font-bold">$FREE/mo</p>
                  <p className="text-muted-foreground">Ideal for families</p>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Tax Preparation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Budgeting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Savings Goals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Investing
                  </li>
                </ul>
                <Button className="w-full" onClick={redirect('/signup')}>Get Started</Button>
              </Card>
              <Card className="p-6 space-y-4 border rounded-lg shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-4xl font-bold">$FREE/mo</p>
                  <p className="text-muted-foreground">Ideal for businesses</p>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Tax Preparation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Budgeting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Savings Goals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Investing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    Custom Reporting
                  </li>
                </ul>
                <Button className="w-full" onClick={redirect('/signup')}>Get Started</Button>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Take Control of Your Finances with C4TALYST
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our all-in-one finance app helps you manage your taxes, investments, budget, and savings goals, all in
                one place.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Download App
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Contact Us</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get in touch with our team for more information or support.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="space-y-5">
                <div className="grid gap-2">
                  <Input id="name" placeholder="Name" />
                </div>
                <div className="grid gap-2">
                  <Input id="email" type="email" placeholder="Email" />
                </div>
                <div className="grid gap-2">
                  <Textarea id="message" placeholder="Messagee" className="min-h-[150px]" />
                </div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 C4TALYST. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/tos" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function CheckIcon(props) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function CogIcon(props) {
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


function CurrencyIcon(props) {
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
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </svg>
  )
}


function ImportIcon(props) {
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
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
    </svg>
  )
}


function PocketIcon(props) {
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
      <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" />
      <polyline points="8 10 12 14 16 10" />
    </svg>
  )
}


function SaveIcon(props) {
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
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  )
}


function XIcon(props) {
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