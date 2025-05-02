import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getTransactionsByDateRange } from "@/lib/supabase-transactions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Define the structure of a transaction based on Supabase schema
interface Transaction {
  id: string; // Assuming Supabase uses string IDs (like UUIDs)
  created_at: string; // Supabase timestamp
  date: string; // Date string 'YYYY-MM-DD'
  type: "Income" | "Expense";
  category: string;
  amount: number;
  description?: string | null;
}

// Update calculateSummary to handle date strings and potential null amounts
const calculateSummary = (transactions: Transaction[]) => {
  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    categoryTotals: {} as Record<string, number>,
  };

  transactions.forEach(transaction => {
    const amount = transaction.amount || 0; // Handle potential null/undefined amounts
    if (transaction.type === "Income") {
      summary.totalIncome += amount;
    } else {
      summary.totalExpense += amount;
    }

    // Track totals by category
    if (!summary.categoryTotals[transaction.category]) {
      summary.categoryTotals[transaction.category] = 0;
    }
    summary.categoryTotals[transaction.category] += amount;
  });

  summary.netProfit = summary.totalIncome - summary.totalExpense;

  return summary;
};

const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Default to start of current month
    to: new Date(), // Default to today
  });
  const [filterType, setFilterType] = useState("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions when date range changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      setLoading(true);
      setError(null);
      try {
        // Format dates for Supabase query (YYYY-MM-DD)
        const startDate = format(dateRange.from, "yyyy-MM-dd");
        const endDate = format(dateRange.to, "yyyy-MM-dd");

        const data = await getTransactionsByDateRange(startDate, endDate);
        setTransactions(data as Transaction[]); // Cast data to Transaction[]
      } catch (err: any) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to load report data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange]);

  // Filter transactions based on type (client-side filtering after fetch)
  const filteredTransactions = transactions.filter(transaction => {
    // No need to filter by date here as it's done in the query
    const matchesType =
      filterType === "All" ||
      transaction.type === filterType;

    return matchesType;
  });

  const summary = calculateSummary(filteredTransactions);

  // Handle date range selection from Calendar
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Export as CSV function
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const headers = ["Date", "Type", "Category", "Amount"];
    const rows = filteredTransactions.map(tx => [
      tx.date,
      tx.type,
      tx.category,
      tx.amount
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export as PDF function
  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Transaction Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);
    const headers = ["Date", "Type", "Category", "Amount"];
    const rows = filteredTransactions.map(tx => [
      tx.date,
      tx.type,
      tx.category,
      tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    ]);
    const y = 30;
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: y,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    doc.save("transactions_report.pdf");
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
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[300px] justify-start text-left font-normal",
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
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
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
        {loading ? (
          <>
            <Card><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Report</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} transactions for the selected period and filter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3 mb-2" />
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">{error}</div>
          ) : (
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
                      <TableCell>{format(parseISO(transaction.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "Income" ? "secondary" : "destructive"}
                          className="capitalize"
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
                          ${(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No transactions found for the selected period and filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
