"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCookies } from 'react-cookie';

export function ExpenseTable() {
  const [expenses, setExpenses] = useState<{ id: number; name: string; frequency: string; amount: number; date: string; color: string; description: string; }[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);

  const frequencyToEnum = (frequency: string) => {
    switch (frequency) {
      case 'Daily':
        return "daily"
      case 'Weekly':
        return 'weekly'
      case 'Monthly':
        return 'monthly'
      case 'Yearly':
        return 'annually'
      case 'One-time':
        return 'one_time'
      case 'Bi-Weekly':
        return 'bi_weekly'
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await fetch('http://35.83.115.56/expense', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchExpenseData();
  }, []);

  const [newExpense, setNewExpense] = useState({
    name: "",
    frequency: "",
    amount: "",
    date: "",
    description: "",
    color: `#FFFFFF`,
  })

  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false)
  const [isEditExpenseDialogOpen, setIsEditExpenseDialogOpen] = useState(false)
  const [expenseToEdit, setExpenseToEdit] = useState(null)

  const handleAddExpense = async () => {
    if (newExpense.name && newExpense.frequency && newExpense.amount && newExpense.date) {
      try {
        const response = await fetch('http://35.83.115.56/expense', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newExpense.name,
            frequency: frequencyToEnum(newExpense.frequency),
            amount: parseFloat(newExpense.amount),
            date: newExpense.date,
            description: newExpense.description,
            color: newExpense.color,
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching response:', error);
      }
      
      setExpenses([
        ...expenses,
        {
          id: expenses.length + 1,
          name: newExpense.name,
          frequency: newExpense.frequency,
          amount: parseFloat(newExpense.amount),
          date: newExpense.date,
          color: `#FFFFFF`,
          description: "",
        },
      ])

      setNewExpense({
        name: "",
        frequency: "",
        amount: "",
        date: "",
        description: "",
        color: `#FFFFFF`,
      })

      setIsAddExpenseDialogOpen(false)
    }
  }

  const handleEditExpense = (id: number, updatedExpense: any) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              name: updatedExpense.name,
              frequency: updatedExpense.frequency,
              amount: updatedExpense.amount,
              date: updatedExpense.date,
              color: updatedExpense.color,
              description: updatedExpense.description,
            }
          : expense,
      ),
    )
    setIsEditExpenseDialogOpen(false)
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleOpenEditExpenseDialog = (expense: any) => {
    setExpenseToEdit(expense)
    setIsEditExpenseDialogOpen(true)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
        <CardDescription>Keep track of your expenses and manage your budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 border rounded-lg overflow-auto">
          <Table className="mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Expense</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: expense.color }} />
                    {expense.name}
                  </TableCell>
                  <TableCell>{expense.frequency}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                          <div className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditExpenseDialog(expense)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteExpense(expense.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-4 mt-4">
          <Button onClick={() => setIsAddExpenseDialogOpen(true)}>Add Expense</Button>
        </div>
        <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
          <DialogContent className="sm:max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>Enter the details of your new expense.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Expense Name
                  </Label>
                  <Input
                    id="name"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    placeholder="Grocery shopping"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-foreground">
                    Frequency
                  </Label>
                  <Select
                    id="frequency"
                    value={newExpense.frequency}
                    onValueChange={(value) => setNewExpense({ ...newExpense, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-foreground">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Grocery shopping for the week"
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsAddExpenseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditExpenseDialogOpen} onOpenChange={setIsEditExpenseDialogOpen}>
          <DialogContent className="sm:max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>Update the details of the expense.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Expense Name
                  </Label>
                  <Input
                    id="name"
                    value={expenseToEdit?.name || ""}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-foreground">
                    Frequency
                  </Label>
                  <Select
                    id="frequency"
                    value={newExpense.frequency}
                    onValueChange={(value) => setNewExpense({ ...newExpense, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={expenseToEdit?.amount || ""}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-foreground">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={expenseToEdit?.date || ""}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={expenseToEdit?.description || ""}
                  onChange={(e) => setExpenseToEdit({ ...expenseToEdit, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-foreground">
                  Color
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={expenseToEdit?.color || ""}
                  onChange={(e) => setExpenseToEdit({ ...expenseToEdit, color: e.target.value })}
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsEditExpenseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditExpense(expenseToEdit.id, expenseToEdit)}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
