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
import {
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { useCookies } from "react-cookie";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const baseUrl = "http://35.83.115.56:80";

export default function Component() {
  const [investments, setInvestments] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [showCreateInvestmentDialog, setShowCreateInvestmentDialog] =
    useState(false);
  const [showCreatePortfolioDialog, setShowCreatePortfolioDialog] =
    useState(false);
  const [showEditInvestmentDialog, setShowEditInvestmentDialog] = useState(false);
  const [showEditPortfolioDialog, setShowEditPortfolioDialog] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [editingPortfolio, setEditingPortfolio] = useState(null);

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

  const handleOpenEditInvestmentDialog = (investment) => {
    setEditingInvestment(investment);
    setShowEditInvestmentDialog(true);
  };

  const handleCloseEditInvestmentDialog = () => {
    setEditingInvestment(null);
    setShowEditInvestmentDialog(false);
  };

  const handleOpenEditPortfolioDialog = (portfolio) => {
    setEditingPortfolio(portfolio);
    setShowEditPortfolioDialog(true);
  };

  const handleCloseEditPortfolioDialog = () => {
    setEditingPortfolio(null);
    setShowEditPortfolioDialog(false);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies, setCookie] = useCookies();

  const handleDeleteInvestment = async (investmentId) => {
    try {
      const response = await fetch(`${baseUrl}/investments/${investmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete investment");
      }

      setInvestments(
        investments.filter((investment) => investment.id !== investmentId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    try {
      const response = await fetch(`${baseUrl}/portfolios/${portfolioId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio");
      }

      // Update portfolios state after deleting
      setPortfolios(portfolios.filter((p) => p.id !== portfolioId));
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to fetch stock prices (implementation needed)
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

      const data = await response.text(); // Assuming API returns price as text
      return parseFloat(data); // Parse the price to a number
    } catch (error) {
      setError(error.message);
      return null; // Return null in case of error
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

        // Fetch stock prices for each investment and update the data
        const updatedPortfolios = await Promise.all(
          data.map(async (portfolio) => {
            const updatedInvestments = await Promise.all(
              portfolio.investments.map(async (investment) => {
                const price = await getPrice(investment.name); // Assuming 'name' field holds the stock symbol
                return {
                  ...investment,
                  currentPrice: price, // Add current price to investment object
                };
              })
            );
            return {
              ...portfolio,
              investments: updatedInvestments,
            };
          })
        );

        setPortfolios(updatedPortfolios);
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
    return (
      total +
      portfolio.investments.reduce((sum, investment) => {
        return sum + parseFloat(investment.amount) * investment.currentPrice;
      }, 0)
    );
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

  const handleUpdateInvestment = async (updatedInvestment) => {
    try {
      const response = await fetch(
        `${baseUrl}/investments/${updatedInvestment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.accessToken}`,
          },
          body: JSON.stringify(updatedInvestment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update investment");
      }

      const data = await response.json();
      setInvestments(
        investments.map((investment) =>
          investment.id === data.id ? data : investment
        )
      );
      setShowEditInvestmentDialog(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdatePortfolio = async (updatedPortfolio) => {
    try {
      const response = await fetch(
        `${baseUrl}/portfolios/${updatedPortfolio.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.accessToken}`,
          },
          body: JSON.stringify(updatedPortfolio.filter((key) => key !== "id")),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update portfolio");
      }

      const data = await response.json();
      setPortfolios(
        portfolios.map((portfolio) =>
          portfolio.id === data.id ? data : portfolio
        )
      );
      setShowEditPortfolioDialog(false);
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
              <Button onClick={handleCreateInvestment}>
                Create Investment
              </Button>
              <Button onClick={handleCreatePortfolio}>
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
                  <TableHead>Shares</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((portfolio) => (
                  <React.Fragment key={portfolio.id}>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="font-bold hover:bg-gray-100"
                        onClick={() => handleOpenEditPortfolioDialog(portfolio)}
                      >
                        {portfolio.name}
                      </TableCell>
                    </TableRow>
                    {portfolio.investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell />
                        <TableCell>{investment.name}</TableCell>
                        <TableCell>{investment.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          $
                          {(
                            investment.amount * investment.currentPrice
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border w-8 h-8"
                              >
                                <div className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenEditInvestmentDialog(investment)
                                }
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteInvestment(investment.id)
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              <ChartAreaChart className="aspect-[9/4]" portfolios={portfolios}/>
            </CardContent>
          </Card>
        </div>
      </div>
      {showCreateInvestmentDialog && (
        <Dialog
          open={showCreateInvestmentDialog}
          onOpenChange={handleCloseCreateInvestmentDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Investment</DialogTitle>
              <DialogDescription>
                Enter the details for your new investment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="investmentName" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="investmentName"
                  placeholder="Investment Symbol"
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="investmentAmount" className="text-right">
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
                <Label htmlFor="investmentPortfolioId" className="text-right">
                  Portfolio
                </Label>
                <Select
                  id="investmentPortfolioId"
                  className="col-span-3"
                  onValueChange={(value) =>
                    setSelectedPortfolioId(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem
                        key={portfolio.id}
                        value={portfolio.id.toString()}
                      >
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
                    portfolio_id: selectedPortfolioId,
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
          onOpenChange={handleCloseCreatePortfolioDialog}
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
                <Label htmlFor="portfolioName" className="text-right">
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
      {showEditInvestmentDialog && editingInvestment && (
        <Dialog
          open={showEditInvestmentDialog}
          onOpenChange={handleCloseEditInvestmentDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Investment</DialogTitle>
              <DialogDescription>
                Modify the details of this investment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="editInvestmentName" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="editInvestmentName"
                  defaultValue={editingInvestment.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="editInvestmentAmount" className="text-right">
                  Shares
                </Label>
                <Input
                  id="editInvestmentAmount"
                  defaultValue={editingInvestment.amount}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label
                  htmlFor="editInvestmentPortfolioId"
                  className="text-right"
                >
                  Portfolio
                </Label>
                <Select
                  id="editInvestmentPortfolioId"
                  className="col-span-3"
                  defaultValue={editingInvestment.portfolio_id.toString()}
                  onValueChange={(value) =>
                    setSelectedPortfolioId(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem
                        key={portfolio.id}
                        value={portfolio.id.toString()}
                      >
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  handleUpdateInvestment({
                    id: editingInvestment.id,
                    name: document.getElementById("editInvestmentName").value,
                    amount: parseFloat(
                      document.getElementById("editInvestmentAmount").value
                    ),
                    portfolio_id: selectedPortfolioId,
                  })
                }
              >
                Save Changes
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={handleCloseEditInvestmentDialog}
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showEditPortfolioDialog && editingPortfolio && (
        <Dialog
          open={showEditPortfolioDialog}
          onOpenChange={handleCloseEditPortfolioDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Portfolio</DialogTitle>
              <DialogDescription>
                Modify the name of this portfolio.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="editPortfolioName" className="text-right">
                  Name
                </Label>
                <Input
                  id="editPortfolioName"
                  defaultValue={editingPortfolio.name}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  handleUpdatePortfolio({
                    id: editingPortfolio.id,
                    name: document.getElementById("editPortfolioName").value,
                  })
                }
              >
                Save Changes
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={handleCloseEditPortfolioDialog}
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

interface Portfolio {
    id: string;
    name: string;
}

interface ChartData {
    month: string;
    [key: string]: number | string;
}

function ChartAreaChart(props: { portfolios: Portfolio[] }) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [cookies] = useCookies();

    useEffect(() => {
        const fetchData = async () => {
            try {

            const portfolioData = await fetch(`${baseUrl}/portfolio/historical`, {
                headers: {
                    Authorization: `Bearer ${cookies.accessToken}`,
                },
            }).then((response) => response.json());
            
            const formattedData: ChartData[] = [];
            for (let i = 0; i < 6; i++) {
                const monthData: ChartData = { month: i === 0 ? 'This Month' : `${i} Months Ago` };
                props.portfolios.forEach((portfolio, index) => {
                    const portfolioName = portfolio.name;
                    const historicalValues = portfolioData[portfolioName] || []; // Assuming historical data is an object with stock names as keys
                    monthData[portfolioName] = historicalValues[i] || 0; // Handle cases where historical data might be missing for a specific month
                });
                formattedData.push(monthData);
            }
            
            setChartData(formattedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [props.portfolios]);

    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    return (
        <div {...props}>
            <ChartContainer className="min-h-[300px]" config={{}}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
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
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    {props.portfolios.map((portfolio) => (
                        <Area
                            key={portfolio.id}
                            type="natural"
                            dataKey={portfolio.name}
                            stackId="1"
                            stroke={randomColor}
                            fillOpacity={0}
                        />
                    ))}
                </AreaChart>
            </ChartContainer>
        </div>
    );
}