"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CartesianGrid, XAxis, Area, AreaChart, Line, LineChart, YAxis } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { useCookies } from 'react-cookie';

export function Performance() {
  const [expenses, setExpenses] = useState<{ id: number; name: string; frequency: string; amount: number; date: string; color: string; description: string; }[]>([]);
  const [incomes, setIncomes] = useState<{ id: number; name: string; frequency: string; amount: number; color: string; description: string; }[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const [performanceData, setPerformanceData] = useState<{ month: string; income: number; expense: number; gain: number }[]>([]);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchExpenseData();
    fetchIncomeData();
  }, []);

  useEffect(() => {
    const calculatePerformanceData = () => {
      const months = ["January", "February", "March", "April", "May", "June"];
      const data: { month: string; income: number; expense: number; gain: number }[] = [];
      months.forEach((month) => {
        let totalIncome = 0;
        let totalExpense = 0;
        incomes.forEach((income) => {
          if (new Date(income.date).getMonth() + 1 === new Date(month).getMonth() + 1) {
            totalIncome += income.amount;
          }
        });
        expenses.forEach((expense) => {
          if (new Date(expense.date).getMonth() + 1 === new Date(month).getMonth() + 1) {
            totalExpense += expense.amount;
          }
        });
        data.push({
          month,
          income: totalIncome,
          expense: totalExpense,
          gain: totalIncome - totalExpense,
        });
      });
      setPerformanceData(data);
    };
    calculatePerformanceData();
  }, [expenses, incomes]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>A breakdown of your expenses and incomes over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <AreaChartStacked data={performanceData} className="aspect-[16/9]" /> {/* Pass performanceData here */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span>Expenses</span>
              <div className="h-3 w-3 rounded-full bg-secondary" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              {/* TODO: Calculate and display financial health score */}
              <span>8/10</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            {/* TODO: Display insightful financial advice based on the data */}
            Your financial situation is looking good overall. You're managing your expenses well and your income is
            steady. Keep up the great work!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function AreaChartStacked(props: { data: { month: string; income: number; expense: number; gain: number }[]; className?: string }) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          income: {
            label: "Income",
            color: "hsl(var(--chart-2))",
          },
          expense: {
            label: "Expense",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[300px]"
      >
        <AreaChart
          accessibilityLayer
          data={props.data}
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
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Area
            dataKey="expense"
            type="natural"
            fill="var(--color-expense)"
            fillOpacity={0.4}
            stroke="var(--color-expense)"
            stackId="a"
          />
          <Area
            dataKey="income"
            type="natural"
            fill="var(--color-income)"
            fillOpacity={0.4}
            stroke="var(--color-income)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function LinechartChart(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}


function StarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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