import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Budget() {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies, setCookie] = useCookies();
  const [goals, setGoals] = useState([]);
  const [showCreateGoalDialog, setShowCreateGoalDialog] = useState(false);

  useEffect(() => {
    const fetchBudgetData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://35.83.115.56:80/budgets", {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch budget data");
        }

        const data = await response.json();
        if (data.length === 0) {
          const createResponse = await fetch("http://35.83.115.56:80/budgets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.accessToken}`,
            },
            body: JSON.stringify({
              name: "My Budget",
            }),
          });

          if (!createResponse.ok) {
            throw new Error("Failed to create a new budget");
          }

          const newBudgetData = await createResponse.json();
          setBudgetData([newBudgetData]);
        } else {
          setBudgetData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchGoals = async () => {
      try {
        const response = await fetch("http://35.83.115.56:80/goals", {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }

        const data = await response.json();
        setGoals(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBudgetData();
    fetchGoals();
  }, []);

  const handleDeleteGoal = async (goalId) => {
    try {
      const response = await fetch(`http://35.83.115.56:80/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      setGoals(goals.filter((goal) => goal.id !== goalId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const response = await fetch("http://35.83.115.56:80/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal");
      }

      const newGoal = await response.json();
      setGoals([...goals, newGoal]); 
      setShowCreateGoalDialog(false); 
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const budget = budgetData[0];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
              <CardDescription>
                Track your monthly expenses across different categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Discretionary</TableCell>
                    <TableCell>${budget.discretionary_spending}</TableCell>
                    <TableCell>
                      {(
                        (budget.discretionary_spending / budget.total_income) *
                        100
                      ).toFixed(2)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Emergency Fund
                    </TableCell>
                    <TableCell>${budget.emergency_fund}</TableCell>
                    <TableCell>
                      {(
                        (budget.emergency_fund / budget.total_income) *
                        100
                      ).toFixed(2)}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>
                Create, view, and edit your financial goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Goal</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{goal.name}</TableCell>
                      <TableCell>${goal.target_amount}</TableCell>
                      <TableCell>
                        {/* Display progress bar here based on goal.current_amount / goal.target_amount */}
                        <div className="relative h-2 w-full rounded-full bg-muted">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-primary"
                            style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }} 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <div className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteGoal(goal.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                onClick={() => setShowCreateGoalDialog(true)}
              >
                Add New Goal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Create Goal Dialog */}
      <Dialog
        open={showCreateGoalDialog}
        onOpenChange={setShowCreateGoalDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Enter the details for your new goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="goalName"
                placeholder="Goal Name"
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="currentAmount" className="text-right">
                Current Amount
              </Label>
              <Input
                id="goalCurrentAmount"
                placeholder="Current Amount"
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="targetAmount" className="text-right">
                Target Amount
              </Label>
              <Input
                id="goalTargetAmount"
                placeholder="Target Amount"
                className="col-span-3"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                handleCreateGoal({
                  name: document.getElementById("goalName").value,
                  target_amount: parseFloat(
                    document.getElementById("goalTargetAmount").value
                  ),
                  current_amount: parseFloat(
                    document.getElementById("goalCurrentAmount").value
                  ),
                });
              }}
            >
              Create Goal
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateGoalDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}