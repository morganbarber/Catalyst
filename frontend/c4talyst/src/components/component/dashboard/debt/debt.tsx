import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export function Debt() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <section className="bg-card rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Debt Tracking</h2>
            <Button size="sm">Add Debt</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Debt</CardTitle>
              </CardHeader>
              <CardContent className="text-4xl font-bold">$25,432</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payments Due</CardTitle>
              </CardHeader>
              <CardContent className="text-4xl font-bold">$1,234</CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creditor</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Chase Credit Card</TableCell>
                <TableCell>$5,432</TableCell>
                <TableCell>18.99%</TableCell>
                <TableCell>05/15/2023</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Citi Bank Loan</TableCell>
                <TableCell>$12,000</TableCell>
                <TableCell>9.75%</TableCell>
                <TableCell>06/30/2023</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amex Credit Card</TableCell>
                <TableCell>$8,000</TableCell>
                <TableCell>22.99%</TableCell>
                <TableCell>07/01/2023</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
        <section className="bg-card rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Repayment Plans</h2>
            <Button size="sm">Create Plan</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimal Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span>Monthly Payment</span>
                  <span className="font-bold">$1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payoff Time</span>
                  <span className="font-bold">18 months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Interest</span>
                  <span className="font-bold">$2,345</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Start Plan</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span>Monthly Payment</span>
                  <Input type="number" className="w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Payoff Time</span>
                  <Input type="number" className="w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className="bg-card rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Debt Advice</h2>
            <Button size="sm">View Resources</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Debt Management Tips</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <LightbulbIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Prioritize High-Interest Debts</h3>
                    <p className="text-muted-foreground">
                      Focus on paying off debts with the highest interest rates first to save on interest charges.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <WalletIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Create a Debt Repayment Plan</h3>
                    <p className="text-muted-foreground">
                      Develop a structured plan to pay off your debts, including setting realistic payment goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Improve Your Credit Score</h3>
                    <p className="text-muted-foreground">
                      Adopt strategies to build and maintain a good credit score, which can help you access better
                      financing options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Debt Consolidation Options</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <CreditCardIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Balance Transfer Cards</h3>
                    <p className="text-muted-foreground">
                      Explore balance transfer credit cards that offer low or 0% APR for a promotional period, allowing
                      you to consolidate and pay off your debts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSignIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Debt Consolidation Loans</h3>
                    <p className="text-muted-foreground">
                      Consider taking out a debt consolidation loan to combine multiple debts into a single,
                      lower-interest payment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <HomeIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Home Equity Loans</h3>
                    <p className="text-muted-foreground">
                      If you own a home, you may be able to use the equity to secure a loan with a lower interest rate
                      to pay off your debts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

function CreditCardIcon(props: any) {
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


function DollarSignIcon(props: any) {
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


function HomeIcon(props: any) {
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


function LightbulbIcon(props: any) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}


function ShieldCheckIcon(props: any) {
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
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}


function WalletIcon(props: any) {
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


function XIcon(props: any) {
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
