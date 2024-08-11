import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CartesianGrid, XAxis, YAxis, Area, AreaChart, Line, LineChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { useCookies } from "react-cookie"

export default function Investing() {
  const [investments, setInvestments] = useState([])
  const [portfolios, setPortfolios] = useState([])
  const [historicalData, setHistoricalData] = useState([])
  const [showCreateInvestmentDialog, setShowCreateInvestmentDialog] = useState(false)
  const [showCreatePortfolioDialog, setShowCreatePortfolioDialog] = useState(false)
  const [cookies] = useCookies(["accessToken"])

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch("http://35.83.115.56/investments", {
          headers: {
            "Authorization": `Bearer ${cookies.accessToken}`,
          },  
        })
        if (response.ok) {
          const data = await response.json()
          setInvestments(data)
        } else {
          console.error("Failed to fetch investments")
        }
      } catch (error) {
        console.error("Error fetching investments:", error)
      }
    }

    const fetchPortfolios = async () => {
      try {
        const response = await fetch("http://35.83.115.56/portfolios", {
          headers: {
            "Authorization": `Bearer ${cookies.accessToken}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPortfolios(data)
        } else {
          console.error("Failed to fetch portfolios")
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error)
      }
    }

    const fetchHistoricalData = async () => {
      // Replace this with actual API call to fetch historical data
      try {
        // Assuming the API returns data in the format:
        // [ { date: "2023-07-01", "Portfolio A": 12000, "Portfolio B": 15000, ... }, ... ]
        const response = await fetch("/api/historical_data", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setHistoricalData(data)
        } else {
          console.error("Failed to fetch historical data")
        }
      } catch (error) {
        console.error("Error fetching historical data:", error)
      }
    }

    fetchInvestments()
    fetchPortfolios()
    fetchHistoricalData()
  }, [])

  const totalValue = portfolios.reduce((total, portfolio) => {
    const portfolioInvestments = investments.filter((investment) => investment.portfolio_id === portfolio.id)
    const portfolioValue = portfolioInvestments.reduce((sum, investment) => sum + parseFloat(investment.amount), 0)
    return total + portfolioValue
  }, 0)

  const handleCreateInvestment = () => {
    setShowCreateInvestmentDialog(true)
  }

  const handleCreatePortfolio = () => {
    setShowCreatePortfolioDialog(true)
  }

  const handleCloseCreateInvestmentDialog = () => {
    setShowCreateInvestmentDialog(false)
  }

  const handleCloseCreatePortfolioDialog = () => {
    setShowCreatePortfolioDialog(false)
  }

  const handleSaveInvestment = async (newInvestment) => {
    try {
      const response = await fetch("http://35.83.115.56/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auhorization": `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify(newInvestment),
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setInvestments([...investments, data])
        setShowCreateInvestmentDialog(false)
      } else {
        console.error("Failed to create investment")
      }
    } catch (error) {
      console.error("Error creating investment:", error)
    }
  }

  const handleSavePortfolio = async (newPortfolio) => {
    try {
      const response = await fetch("http://35.83.115.56/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auhorization": `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify(newPortfolio),
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setPortfolios([...portfolios, data])
        setShowCreatePortfolioDialog(false)
      } else {
        console.error("Failed to create portfolio")
      }
    } catch (error) {
      console.error("Error creating portfolio:", error)
    }
  }

  return (
    <div className="grid gap-8 p-6 md:p-8">
      <div className="grid gap-4">
        <h1 className="text-2xl font-bold">Investment Manager</h1>
        <p className="text-muted-foreground">View and manage your investment portfolios and stocks.</p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Investments</h2>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">Total Value: ${totalValue.toFixed(2)}</div>
              <Button onClick={handleCreateInvestment}>Create Investment</Button>
              <Button onClick={handleCreatePortfolio}>Create Portfolio</Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Risk Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((portfolio) => (
                  <React.Fragment key={portfolio.id}>
                    {investments
                      .filter((investment) => investment.portfolio_id === portfolio.id)
                      .map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell>{portfolio.name}</TableCell>
                          <TableCell>{investment.name}</TableCell>
                          <TableCell>${parseFloat(investment.amount).toFixed(2)}</TableCell>
                          <TableCell>{investment.risk_profile}</TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="grid gap-6">
          <h2 className="text-xl font-bold">Portfolio Performance</h2>
          <Card>
            <CardContent>
              <HistoricalChart data={historicalData} />
            </CardContent>
          </Card>
        </div>
      </div>
      {showCreateInvestmentDialog && (
        <Dialog open={showCreateInvestmentDialog} onOpenChange={handleCloseCreateInvestmentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Investment</DialogTitle>
              <DialogDescription>Enter the details for your new investment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="investmentName" placeholder="Investment Name" className="col-span-3" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="investmentAmount" placeholder="Investment Amount" className="col-span-3" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="riskProfile" className="text-right">
                  Risk Profile
                </Label>
                <Input id="investmentRiskProfile" placeholder="Risk Profile" className="col-span-3" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="portfolioId" className="text-right">
                  Portfolio ID
                </Label>
                <Input id="investmentPortfolioId" placeholder="Portfolio ID" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={(e) =>
                  handleSaveInvestment({
                    name: document.getElementById("investmentName").value,
                    amount: parseFloat(document.getElementById("investmentAmount").value),
                    risk_profile: document.getElementById("investmentRiskProfile").value,
                    portfolio_id: parseInt(document.getElementById("investmentPortfolioId").value),
                  })
                }
              >
                Create Investment
              </Button>
              <div>
                <Button variant="outline" onClick={handleCloseCreateInvestmentDialog}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showCreatePortfolioDialog && (
        <Dialog open={showCreatePortfolioDialog} onOpenChange={handleCloseCreatePortfolioDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Portfolio</DialogTitle>
              <DialogDescription>Enter the details for your new portfolio.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="portfolioName" placeholder="Portfolio Name" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={(e) =>
                  handleSavePortfolio({
                    name: document.getElementById("portfolioName").value,
                  })
                }
              >
                Create Portfolio
              </Button>
              <div>
                <Button variant="outline" onClick={handleCloseCreatePortfolioDialog}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function HistoricalChart({ data }) {
  return (
    <ChartContainer className="h-[400px]" config={{}}>
      <LineChart data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip />
        {Object.keys(data[0] || { value: 0 })
          .filter((key) => key !== "date")
          .map((portfolioName, index) => (
            <Line key={index} type="monotone" dataKey={portfolioName} stroke={`var(--chart-${index + 1})`}/>
          ))}
      </LineChart>
    </ChartContainer>
  )
}