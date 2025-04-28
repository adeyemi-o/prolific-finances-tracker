
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data - replace with real data from Supabase
const generateMockReportData = () => {
  const startDate = new Date(2025, 3, 1);
  const endDate = new Date(2025, 3, 28);
  const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate daily data
  const dailyData = [];
  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    dailyData.push({
      date: currentDate,
      income: Math.floor(Math.random() * 1500) + 500,
      expense: Math.floor(Math.random() * 800) + 200,
    });
  }
  
  // Generate category data
  const categories = [
    { name: "Client Payment", amount: 32450.75, type: "Income" },
    { name: "Insurance Reimbursement", amount: 18975.50, type: "Income" },
    { name: "Government Grant", amount: 5000, type: "Income" },
    { name: "Payroll", amount: 26780.45, type: "Expense" },
    { name: "Supplies", amount: 8573.25, type: "Expense" },
    { name: "Rent", amount: 4800, type: "Expense" },
    { name: "Utilities", amount: 1250.75, type: "Expense" },
    { name: "Insurance", amount: 2950, type: "Expense" },
  ];
  
  return { dailyData, categories };
};

const reportData = generateMockReportData();

// Chart data
const prepareChartData = (data: any[], startDate: Date, endDate: Date) => {
  return data
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    })
    .map(item => ({
      date: format(new Date(item.date), "MMM dd"),
      Income: item.income,
      Expense: item.expense,
      Profit: item.income - item.expense
    }));
};

// Prepare summary data
const prepareSummaryData = (
  categories: any[],
  type: string,
  startDate: Date,
  endDate: Date
) => {
  // In a real app, you would filter by date range here
  return categories.filter(cat => cat.type === type);
};

const Reports = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(2025, 3, 1),
    to: new Date(2025, 3, 28),
  });
  
  const chartData = prepareChartData(
    reportData.dailyData,
    dateRange.from,
    dateRange.to || dateRange.from
  );
  
  const incomeSummary = prepareSummaryData(
    reportData.categories,
    "Income",
    dateRange.from,
    dateRange.to || dateRange.from
  );
  
  const expenseSummary = prepareSummaryData(
    reportData.categories,
    "Expense",
    dateRange.from,
    dateRange.to || dateRange.from
  );
  
  const totalIncome = incomeSummary.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseSummary.reduce((sum, item) => sum + item.amount, 0);
  
  const handleDownloadCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log("Downloading CSV report");
  };
  
  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF file
    console.log("Downloading PDF report");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCSV}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalIncome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="Income" fill="#2563EB" />
                <Bar dataKey="Expense" fill="#DC2626" />
                <Bar dataKey="Profit" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeSummary.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {((item.amount / totalIncome) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseSummary.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {((item.amount / totalExpenses) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
