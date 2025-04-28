
import { useState } from "react";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data generator for reports
const generateMockReportData = () => {
  const transactions = [];
  const startDate = new Date(2025, 3, 1);
  const endDate = new Date(2025, 3, 28);
  const typeOptions = ["Income", "Expense"];
  const incomeCategories = ["Client Payment", "Insurance Reimbursement", "Government Grant", "Other Income"];
  const expenseCategories = ["Payroll", "Supplies", "Rent", "Utilities", "Insurance", "Other Expenses"];
  
  for (let i = 0; i < 20; i++) {
    const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    const categories = type === "Income" ? incomeCategories : expenseCategories;
    
    transactions.push({
      id: i + 1,
      date: new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      ),
      type,
      category: categories[Math.floor(Math.random() * categories.length)],
      amount: parseFloat((Math.random() * 2000 + 500).toFixed(2)),
    });
  }
  
  return transactions;
};

const mockTransactions = generateMockReportData();

// Calculate summary data
const calculateSummary = (transactions: any[]) => {
  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    categoryTotals: {} as Record<string, number>,
  };
  
  transactions.forEach(transaction => {
    if (transaction.type === "Income") {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpense += transaction.amount;
    }
    
    // Track totals by category
    if (!summary.categoryTotals[transaction.category]) {
      summary.categoryTotals[transaction.category] = 0;
    }
    summary.categoryTotals[transaction.category] += transaction.amount;
  });
  
  summary.netProfit = summary.totalIncome - summary.totalExpense;
  
  return summary;
};

const Reports = () => {
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: new Date(2025, 3, 1),
    to: new Date(2025, 3, 28)
  });
  const [filterType, setFilterType] = useState("All");
  
  // Filter transactions based on date range and type
  const filteredTransactions = mockTransactions.filter(transaction => {
    const isInDateRange = 
      transaction.date >= dateRange.from && 
      transaction.date <= dateRange.to;
    
    const matchesType = 
      filterType === "All" || 
      transaction.type === filterType;
    
    return isInDateRange && matchesType;
  });
  
  const summary = calculateSummary(filteredTransactions);
  
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange({ 
      from: range.from || dateRange.from, 
      to: range.to || dateRange.to 
    });
  };
  
  // Export as CSV function - in a production app, this would create a CSV file to download
  const handleExportCSV = () => {
    console.log("Exporting CSV with filtered data", filteredTransactions);
    // Implementation would use react-csv or similar library
    alert("CSV export functionality will be implemented with react-csv");
  };
  
  // Export as PDF function - in a production app, this would create a PDF to download
  const handleExportPDF = () => {
    console.log("Exporting PDF with filtered data", filteredTransactions);
    // Implementation would use react-pdf or similar library
    alert("PDF export functionality will be implemented with react-pdf");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
        <p className="text-muted-foreground">
          View and export financial reports for your business
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto justify-start text-left font-normal"
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
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={{
                  from: dateRange?.from,
                  to: dateRange?.to,
                }}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-full md:w-auto">
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Transactions</SelectItem>
              <SelectItem value="Income">Income Only</SelectItem>
              <SelectItem value="Expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${summary.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${summary.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Report</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} transactions for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          transaction.type === "Income"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span 
                        className={
                          transaction.type === "Income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === "Income" ? "+" : "-"}
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transactions found for the selected period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
