"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  YAxis,
} from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { useCookies } from 'react-cookie';
import { format, parseISO } from 'date-fns';

export function Performance() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const [chartData, setChartData] = useState([]);
  const [score, setScore] = useState(0);
  const [reason, setReason] = useState("");

  const fetchExpenseData = async () => {
    try {
      const response = await fetch("http://35.83.115.56/expense", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch("http://35.83.115.56/llm/score_finances", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const { score, reason } = data;
      setScore(score);
      setReason(reason);

      return { score, reason };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchIncomeData = async () => {
    try {
      const response = await fetch("http://35.83.115.56/income", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setIncomes(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchExpenseData();
    fetchIncomeData();
    fetchPerformanceData();
  }, []);

  useEffect(() => {
    const generateChartData = () => {
      const today = new Date();
      const pastDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      const dailyData = [];
  
      for (let d = new Date(pastDate); d <= today; d.setDate(d.getDate() + 1)) {
        dailyData.push({
          date: new Date(d),
          expenses: 0,
          incomes: 0,
        });
      }
  
      const findDailyData = (expenseDate) => {
        return dailyData.find((d) => d.date.toISOString().split('T')[0] === expenseDate.toISOString().split('T')[0]);
      };
  
      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const foundDay = findDailyData(expenseDate);
        if (foundDay) {
          switch (expense.frequency.toLowerCase()) {
            case "daily":
              foundDay.expenses += parseFloat(expense.amount);
              break;
            case "weekly":
              if (expenseDate.getDay() === expenseDate.getUTCDay()) {
                foundDay.expenses += parseFloat(expense.amount);
              }
              break;
            case "monthly":
              if (expenseDate.getDate() === 1) {
                foundDay.expenses += parseFloat(expense.amount);
              }
              break;
            case "one_time":
              foundDay.expenses += parseFloat(expense.amount);
              break;
            default:
              break;
          }
        }
      });
  
      incomes.forEach((income) => {
        dailyData.forEach((day) => {
          const date = new Date(day.date);
          switch (income.frequency.toLowerCase()) {
            case "daily":
              day.incomes += parseFloat(income.amount);
              break;
            case "weekly":
              if (date.getDay() === date.getUTCDay()) {
                day.incomes += parseFloat(income.amount);
              }
              break;
            case "monthly":
              if (date.getDate() === 1) {
                day.incomes += parseFloat(income.amount);
              }
              break;
            default:
              break;
          }
        });
      });
  
      let cumulativeNetIncome = 0;
  
      const calculatedChartData = dailyData.map((item) => {
        const netIncome = item.incomes - item.expenses;
        cumulativeNetIncome += netIncome;
        return {
          date: item.date.toISOString().split('T')[0],
          netIncome: cumulativeNetIncome,
        };
      });
  
      setChartData(calculatedChartData);
    };
  
    generateChartData();
  }, [expenses, incomes]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          A breakdown of your net income over the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <LineChartChart data={chartData} className="aspect-[16/9]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Net Income</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-2xl font-bold">
              <StarIcon className="h-6 w-6 fill-primary" />
              <span>{score}</span>
            </div>
        </div>
        <p className="text-muted-foreground">
            {reason}
        </p>
      </CardContent>
    </Card>
  );
}

function LineChartChart({ data, className }) {
  // Function to filter data points for the start of each month
  const monthlyTickFormat = (data) => {
    return data.filter((d, index) => {
      const date = new Date(d.date);
      // Check if the date is the first day of any month
      return date.getDate() === 1;
    }).map(d => d.date);
  };

  const monthlyTicks = monthlyTickFormat(data);

  return (
    <div className={className}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[300px]"
      >
        <LineChart
          data={data}
          margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={monthlyTicks}
            tickFormatter={(tick) => format(parseISO(tick), 'MMM')}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Line
            type="monotone"
            dataKey="netIncome"
            stroke="#34D399" // Tailwind green-500 color
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
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