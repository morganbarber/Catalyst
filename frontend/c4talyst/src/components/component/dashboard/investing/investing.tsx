"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
  Line,
  LineChart,
} from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { useCookies } from "react-cookie";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

export default function Component() {
  const [investments, setInvestments] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [showCreateInvestmentDialog, setShowCreateInvestmentDialog] =
    useState(false);
  const [showCreatePortfolioDialog, setShowCreatePortfolioDialog] =
    useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

  const handleCreateInvestment = () => {
    setShowCreateInvestmentDialog(true);
  };

  const handleCreatePortfolio = () => {
    setShowCreatePortfolioDialog(true);
  };

  const handleCloseCreateInvestmentDialog = () => {
    setShowCreateInvestmentDialog(false);
  };

  const handleCloseCreatePortfolioDialog = () => {
    setShowCreatePortfolioDialog(false);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies, setCookie] = useCookies();

  const baseUrl = "http://35.83.115.56:80";

  const getPrice = async (symbol) => {
    try {
      const response = await fetch(`${baseUrl}/stocks/${symbol}`, {
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
    });
    
        if (!response.ok) {
          throw new Error("Failed to fetch stock price");
        }
    
        const data = await response.json();
        return data.price;
     } catch (error) {
        setError(error.message);
      }
    };


  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch(`${baseUrl}/investments`, {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch investments");
        }
        const data = await response.json();
        setInvestments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPortfolios = async () => {
      try {
        const response = await fetch(`${baseUrl}/portfolios`, {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch portfolios");
        }
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
    fetchPortfolios();
  }, []);

  const totalValue = portfolios.reduce((total, portfolio) => {
    const portfolioValue = portfolio.investments.reduce(
      (sum, investment) => {
        return sum + parseFloat(investment.amount);
      },
      0
    );
    return total + portfolioValue;
  }, 0);

  const handleSaveInvestment = async (newInvestment) => {
    try {
      const response = await fetch(`${baseUrl}/investments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify(newInvestment),
      });

      if (!response.ok) {
        throw new Error("Failed to create investment");
      }

      const data = await response.json();
      setInvestments([...investments, data]);
      setShowCreateInvestmentDialog(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSavePortfolio = async (newPortfolio) => {
    try {
      const response = await fetch(`${baseUrl}/portfolios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify(newPortfolio),
      });

      if (!response.ok) {
        throw new Error("Failed to create portfolio");
      }

      const data = await response.json();
      setPortfolios([...portfolios, data]);
      setShowCreatePortfolioDialog(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading investments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid gap-8 p-6 md:p-8">
      <div className="grid gap-4">
        <h1 className="text-2xl font-bold">Investment Manager</h1>
        <p className="text-muted-foreground">
          View and manage your investment portfolios.
        </p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Investments</h2>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">
                Total Value: ${totalValue.toFixed(2)}
              </div>
              <Button onClick={handleCreateInvestment}>{" "}
                {/* Fixed */}
                Create Investment
              </Button>
              <Button onClick={handleCreatePortfolio}>{" "}
                {/* Fixed */}
                Create Portfolio
              </Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((portfolio) => (
                  <React.Fragment key={portfolio.id}>
                    <TableRow>
                      <TableCell colSpan={4} className="font-bold">
                        {portfolio.name}
                      </TableCell>
                    </TableRow>
                    {portfolio.investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell />
                        <TableCell>{investment.name}</TableCell>
                        <TableCell>{investment.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ${investment.amount * getPrice(investment.name)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="grid gap-6">
          <h2 className="text-xl font-bold">Stock Prices</h2>
          <Card>
            <CardContent>
              <ChartAreaChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
      </div>
      {showCreateInvestmentDialog && (
        <Dialog open={showCreateInvestmentDialog} onOpenChange={handleCreateInvestment}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Investment</DialogTitle>
              <DialogDescription>
                Enter the details for your new investment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="investmentName"
                  placeholder="Investment Symbol"
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="amount" className="text-right">
                  Shares
                </Label>
                <Input
                  id="investmentAmount"
                  placeholder="Shares"
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="portfolioId" className="text-right">
                  Portfolio
                </Label>
                <Select
                  id="investmentPortfolioId"
                  className="col-span-3"
                  onValueChange={(value) => setSelectedPortfolioId(parseInt(value))} 
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter onSubmit={(e) => e.preventDefault()}>
              <Button
                type="submit"
                onClick={() =>
                  handleSaveInvestment({
                    name: document.getElementById("investmentName").value,
                    amount: parseFloat(
                      document.getElementById("investmentAmount").value
                    ),
                    portfolio_id: selectedPortfolioId, // Use the selected portfolio ID
                  })
                }
              >
                Create Investment
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={handleCloseCreateInvestmentDialog}
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showCreatePortfolioDialog && (
        <Dialog
          open={showCreatePortfolioDialog}
          onOpenChange={handleCreatePortfolio}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Portfolio</DialogTitle>
              <DialogDescription>
                Enter the details for your new portfolio.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="portfolioName"
                  placeholder="Portfolio Name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  handleSavePortfolio({
                    name: document.getElementById("portfolioName").value,
                  })
                }
              >
                Create Portfolio
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={handleCloseCreatePortfolioDialog}
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ChartAreaChart(props) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
          mobile: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="min-h-[300px]"
      >
        <AreaChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186, mobile: 80 },
            { month: "February", desktop: 305, mobile: 200 },
            { month: "March", desktop: 237, mobile: 120 },
            { month: "April", desktop: 73, mobile: 190 },
            { month: "May", desktop: 209, mobile: 130 },
            { month: "June", desktop: 214, mobile: 140 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}