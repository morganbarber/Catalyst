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
import { ValueProvider, useValue } from "./financeContext"

export function IncomeTable() {
  const [Incomes, setIncomes] = useState<{ id: number; name: string; frequency: string; amount: number; color: string; description: string; }[]>([]);
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

  const enumToFrequency = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily'
      case 'weekly':
        return 'Weekly'
      case 'monthly':
        return 'Monthly'
      case 'annually':
        return 'Yearly'
      case 'one_time':
        return 'One-time'
      case 'bi_weekly':
        return 'Bi-Weekly'
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch('http://35.83.115.56/income', {
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
        setIncomes(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchIncomeData();
  }, []);

  const [newIncome, setNewIncome] = useState({
    name: "",
    frequency: "",
    amount: "",
    description: "",
    color: `#FFFFFF`,
  })

  const [isAddIncomeDialogOpen, setIsAddIncomeDialogOpen] = useState(false)
  const [isEditIncomeDialogOpen, setIsEditIncomeDialogOpen] = useState(false)
  const [isIncomeDetailsDialogOpen, setIsIncomeDetailsDialogOpen] = useState(false)
  const [IncomeToEdit, setIncomeToEdit] = useState(null)
  const [incomeToView, setIncomeToView] = useState(null)

  const handleAddIncome = async () => {
    if (newIncome.name && newIncome.frequency && newIncome.amount) {
      try {
        const response = await fetch('http://35.83.115.56/income', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newIncome.name,
            frequency: frequencyToEnum(newIncome.frequency),
            amount: parseFloat(newIncome.amount),
            description: newIncome.description,
            color: newIncome.color,
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching response:', error);
      }
      
      setIncomes([
        ...Incomes,
        {
          id: Incomes.length + 1,
          name: newIncome.name,
          frequency: newIncome.frequency,
          amount: parseFloat(newIncome.amount),
          color: `#FFFFFF`,
          description: "",
        },
      ])

      setNewIncome({
        name: "",
        frequency: "",
        amount: "",
        description: "",
        color: `#FFFFFF`,
      })

      setIsAddIncomeDialogOpen(false)
    }
  }

  const handleEditIncome = async (id: number, updatedIncome: any) => {
    setIncomes(
      Incomes.map((income) =>
        income.id === id
          ? {
              ...income,
              name: updatedIncome.name,
              frequency: updatedIncome.frequency,
              amount: updatedIncome.amount,
              color: updatedIncome.color,
              description: updatedIncome.description,
            }
          : income,
      ),
    )

    const income = Incomes.find((income) => income.id === id);
    
    try {
      const response = await fetch('http://35.83.115.56/income/' + id, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${cookies.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedIncome.name ?? income.name,
          frequency: frequencyToEnum(updatedIncome.frequency) ?? frequencyToEnum(income.frequency),
          amount: parseFloat(updatedIncome.amount.toString()) ?? parseFloat(income.amount.toString()),
          description: updatedIncome.description ?? income.description,
          color: updatedIncome.color ?? income.color,
        }),
      });
      console.log(updatedIncome.frequency)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error('Error deleting income:', error);
    }
    setIsEditIncomeDialogOpen(false)
  }

  const handleDeleteIncome = async (id: number, event) => {
    event.stopPropagation();
    try {
      const response = await fetch('http://35.83.115.56/income/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${cookies.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
    setIncomes(Incomes.filter((income) => income.id !== id))
  }

  const handleOpenEditIncomeDialog = (income, event) => {
    setIncomeToEdit(income)
    setIsEditIncomeDialogOpen(true)
    setIsIncomeDetailsDialogOpen(false)
  }

  const handleOpenIncomeDetailsDialog = (income: any) => {
    setIncomeToView(income)
    setIsIncomeDetailsDialogOpen(true)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto d-flex align-items-center justify-content-center">
      <CardHeader>
        <CardTitle>Income Tracker</CardTitle>
        <CardDescription>Keep track of your income and manage your budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 border rounded-lg overflow-auto">
          <Table className="mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Income</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Incomes.map((income) => (
                <TableRow key={income.id} onClick={() => handleOpenIncomeDetailsDialog(income)}>
                  <TableCell className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: income.color }} />
                    {income.name}
                  </TableCell>
                  <TableCell>{enumToFrequency(income.frequency)}</TableCell>
                  <TableCell>${income.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                          <div className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(event) => handleOpenEditIncomeDialog(income, event)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={(event) => handleDeleteIncome(income.id, event)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-4 mt-4">
          <Button onClick={() => setIsAddIncomeDialogOpen(true)}>Add income</Button>
        </div>
        <Dialog open={isAddIncomeDialogOpen} onOpenChange={setIsAddIncomeDialogOpen}>
          <DialogContent className="sm:max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>Add income</DialogTitle>
              <DialogDescription>Enter the details of your new income.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    income Name
                  </Label>
                  <Input
                    id="name"
                    value={newIncome.name}
                    onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                    placeholder="Grocery shopping"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-foreground">
                    Frequency
                  </Label>
                  <Select
                    id="frequency"
                    value={newIncome.frequency}
                    onValueChange={(value) => setNewIncome({ ...newIncome, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
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
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newIncome.description}
                  onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                  placeholder="Grocery shopping for the week"
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsAddIncomeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddIncome}>Add income</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditIncomeDialogOpen} onOpenChange={setIsEditIncomeDialogOpen}>
          <DialogContent className="sm:max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>Edit income</DialogTitle>
              <DialogDescription>Update the details of the income.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    income Name
                  </Label>
                  <Input
                    id="name"
                    value={IncomeToEdit?.name || ""}
                    onChange={(e) => setIncomeToEdit({ ...IncomeToEdit, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-foreground">
                    Frequency
                  </Label>
                  <Select
                    id="frequency"
                    value={newIncome.frequency}
                    onValueChange={(value) => setNewIncome({ ...newIncome, frequency: value })}
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
                    value={IncomeToEdit?.amount || ""}
                    onChange={(e) => setIncomeToEdit({ ...IncomeToEdit, amount: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={IncomeToEdit?.description || ""}
                  onChange={(e) => setIncomeToEdit({ ...IncomeToEdit, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-foreground">
                  Color
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={IncomeToEdit?.color || ""}
                  onChange={(e) => setIncomeToEdit({ ...IncomeToEdit, color: e.target.value })}
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsEditIncomeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditIncome(IncomeToEdit.id, IncomeToEdit)}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isIncomeDetailsDialogOpen} onOpenChange={setIsIncomeDetailsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>Income Details</DialogTitle>
              <DialogDescription>View the details of the selected income.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Income Name
                  </Label>
                  <p>{incomeToView?.name}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-foreground">
                    Frequency
                  </Label>
                  <p>{enumToFrequency(incomeToView?.frequency)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">
                    Amount
                  </Label>
                  <p>${incomeToView?.amount.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <p>{incomeToView?.description}</p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsIncomeDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
