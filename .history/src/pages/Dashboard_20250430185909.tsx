import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend // Added Legend import
} from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, CreditCard, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMobile, useTablet } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { getTransactions } from "@/lib/supabase-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
// Import TooltipProps type
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueChange: number | null;
  expenseChange: number | null;
  netProfitChange: number | null;
}

interface ExpenseData {
  name: string;
  value: number;
}

interface MonthlyData {
  name: string;
  revenue: number;
  expenses: number;
}

interface RecentTransaction {
  id: number;
  name: string;
  date: Date;
  amount: number;
  type: string;
}

// Define Transaction type based on expected Supabase structure
interface Transaction {
  id: number; // Or string if using UUIDs
  created_at: string; // Supabase timestamp
  date: string; // Date string (e.g., 'YYYY-MM-DD')
  type: "Income" | "Expense";
  category: string;
  amount: number;
  description?: string | null;
}

const COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#10B981', '#EC4899', '#F97316', '#3B82F6'];

const formatPercentageChange = (change: number | null): React.ReactNode => {
  if (change === null) {
    return <span className="text-xs text-muted-foreground">vs last period N/A</span>;
  }
  if (change === 0) {
    return <span className="text-xs text-muted-foreground">0% from last period</span>;
  }

  const isPositive = change > 0;
  const colorClass = isPositive ? "text-money-positive" : "text-money-negative"; 
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <p className={cn("text-xs text-muted-foreground flex items-center gap-1", colorClass)}>
      <Icon className="h-3 w-3" />
      {Math.abs(change).toFixed(1)}% from last period
    </p>
  );
};

// Helper function to format currency
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Custom Tooltip Component
const CustomPieTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0]; // Data for the hovered slice
    const name = data.name;
    const value = data.value as number;
    // Access the fill color directly from the payload item associated with the Cell
    const color = data.payload?.fill || data.color; // Fallback to data.color if fill isn't directly on payload

    return (
      <div className="rounded-lg border bg-popover p-2.5 shadow-sm">
        <div className="flex flex-col gap-1">
          {/* Apply the color to the category name */}
          <span style={{ color: color }} className="font-semibold text-sm">{name}</span>
          <span className="text-popover-foreground text-sm">{formatCurrency(value)}</span>
        </div>
      </div>
    );
  }

  return null;
};

const Dashboard = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>("6m");

  const timePeriodLabels: Record<string, string> = {
    "1m": "Last Month",
    "3m": "Last 3 Months",
    "6m": "Last 6 Months",
    "ytd": "Year to Date",
    "all": "All Time",
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const rawData = await getTransactions();
        const formattedTransactions: Transaction[] = (rawData as any[]).map(item => ({
          id: item.id,
          date: new Date(item.date),
          type: item.type,
          category: item.category,
          amount: item.amount,
          description: item.description || ''
        }));
        setTransactions(formattedTransactions);
        processData(formattedTransactions, timePeriod);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error Loading Data",
          description: "Could not fetch transaction data for the dashboard.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, timePeriod]);

  const processData = (data: Transaction[], period: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    let prevStartDate: Date;
    let prevEndDate: Date;

    switch (period) {
      case "1m":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 1, prevEndDate.getDate());
        break;
      case "3m":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 3, prevEndDate.getDate());
        break;
      case "ytd":
        startDate = new Date(now.getFullYear(), 0, 1);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear() - 1, 0, 1);
        break;
      case "all":
        startDate = new Date(0);
        prevStartDate = new Date(0);
        prevEndDate = new Date(0);
        break;
      case "6m":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 6, prevEndDate.getDate());
        break;
    }

    const currentPeriodTransactions = data.filter(tx => tx.date >= startDate && tx.date <= endDate);
    const previousPeriodTransactions = period !== 'all' ? data.filter(tx => tx.date >= prevStartDate && tx.date <= prevEndDate) : [];

    let currentPeriodRevenue = 0;
    let currentPeriodExpenses = 0;
    let previousPeriodRevenue = 0;
    let previousPeriodExpenses = 0;

    currentPeriodTransactions.forEach(tx => {
      if (tx.type === 'Income') {
        currentPeriodRevenue += tx.amount;
      } else if (tx.type === 'Expense') {
        currentPeriodExpenses += tx.amount;
      }
    });

    previousPeriodTransactions.forEach(tx => {
      if (tx.type === 'Income') {
        previousPeriodRevenue += tx.amount;
      } else if (tx.type === 'Expense') {
        previousPeriodExpenses += tx.amount;
      }
    });

    const currentPeriodNetProfit = currentPeriodRevenue - currentPeriodExpenses;
    const previousPeriodNetProfit = previousPeriodRevenue - previousPeriodExpenses;

    const totalRevenue = currentPeriodRevenue;
    const totalExpenses = currentPeriodExpenses;
    const netProfit = currentPeriodNetProfit;

    const calculateChange = (current: number, previous: number): number | null => {
      if (period === 'all') return null;
      if (previous === 0) {
        return current === 0 ? 0 : null;
      }
      return ((current - previous) / previous) * 100;
    };

    const revenueChange = calculateChange(currentPeriodRevenue, previousPeriodRevenue);
    const expenseChange = calculateChange(currentPeriodExpenses, previousPeriodExpenses);
    let netProfitChange: number | null = null;
    if (period !== 'all') {
      if (previousPeriodNetProfit !== 0) {
        netProfitChange = ((currentPeriodNetProfit - previousPeriodNetProfit) / Math.abs(previousPeriodNetProfit)) * 100;
      } else if (currentPeriodNetProfit !== 0) {
        netProfitChange = null;
      } else {
        netProfitChange = 0;
      }
    }

    setSummaryData({
      totalRevenue,
      totalExpenses,
      netProfit,
      revenueChange,
      expenseChange,
      netProfitChange
    });

    const expensesByCategory: Record<string, number> = {};
    currentPeriodTransactions
      .filter(tx => tx.type === 'Expense')
      .forEach(tx => {
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      });
    const formattedExpenseData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    setExpenseData(formattedExpenseData);

    const monthlyAgg: Record<string, { revenue: number; expenses: number }> = {};
    const sixMonthsAgoChart = new Date();
    sixMonthsAgoChart.setMonth(sixMonthsAgoChart.getMonth() - 5);
    sixMonthsAgoChart.setDate(1);
    sixMonthsAgoChart.setHours(0, 0, 0, 0);

    data.filter(tx => tx.date >= sixMonthsAgoChart).forEach(tx => {
      const monthYear = tx.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!monthlyAgg[monthYear]) {
        monthlyAgg[monthYear] = { revenue: 0, expenses: 0 };
      }
      if (tx.type === 'Income') {
        monthlyAgg[monthYear].revenue += tx.amount;
      } else if (tx.type === 'Expense') {
        monthlyAgg[monthYear].expenses += tx.amount;
      }
    });

    const sortedMonthlyData = Object.entries(monthlyAgg)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    setMonthlyData(sortedMonthlyData);

    const sortedTransactions = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());
    const formattedRecent = sortedTransactions.slice(0, 5).map(tx => ({
      id: tx.id,
      name: tx.description || tx.category,
      date: tx.date,
      amount: tx.amount,
      type: tx.type.toLowerCase()
    }));
    setRecentTransactions(formattedRecent);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg sm:col-span-2 lg:col-span-1" />
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (error || !summaryData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Dashboard</h2>
        <p className="text-muted-foreground">{error || "Could not process dashboard data."}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-6 transition-opacity duration-500",
      !isLoading ? "opacity-100" : "opacity-0"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in-slow">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Snapshot of your financial performance for: {timePeriodLabels[timePeriod]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(timePeriodLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in-normal">
        <Card className="glass-card hover-lift transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Total Revenue ({timePeriodLabels[timePeriod]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold amount-display">
              {formatCurrency(summaryData.totalRevenue)}
            </div>
            {formatPercentageChange(summaryData.revenueChange)}
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Total Expenses ({timePeriodLabels[timePeriod]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold amount-display">
              {formatCurrency(summaryData.totalExpenses)}
            </div>
            {formatPercentageChange(summaryData.expenseChange)}
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Net Profit ({timePeriodLabels[timePeriod]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold amount-display">
              {formatCurrency(summaryData.netProfit)}
            </div>
            {formatPercentageChange(summaryData.netProfitChange)}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 animate-in-normal" style={{ animationDelay: '100ms' }}>
        <Card className={`col-span-1 glass-card ${isMobile ? '' : 'hover-lift transition-all duration-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-semibold">Expense Breakdown</CardTitle>
            <Badge variant="outline" className="font-normal text-xs">
              {timePeriodLabels[timePeriod]}
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={isMobile ? "h-[250px] mt-4" : "h-[300px]"}>
              {expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 80 : 110}
                      innerRadius={isMobile ? 40 : 60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
                          stroke="hsl(var(--background))"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No expense data for this period.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 glass-card hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Revenue vs Expenses</CardTitle>
            <Badge variant="outline" className="font-normal text-xs">
              Last 6 Months
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px]">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {isMobile ? (
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 20, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis width={40} tickFormatter={(value) => `$${value/1000}k`} fontSize={10} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))} 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--popover-foreground))',
                          borderRadius: 'var(--radius)',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Expenses" />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis width={60} tickFormatter={(value) => `$${value/1000}k`} fontSize={12} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))} 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--popover-foreground))',
                          borderRadius: 'var(--radius)',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Not enough data for monthly comparison.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="animate-in-normal" style={{ animationDelay: '200ms' }}>
        <Card className="glass-card hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-accent hidden sm:flex">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, i) => (
                  <div
                    key={transaction.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                      "hover:bg-accent/10 border border-border/50"
                    )}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{transaction.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {transaction.date.toLocaleDateString()}
                      </div>
                    </div>
                    <div className={cn(
                      "font-medium tabular-nums text-right ml-4",
                      transaction.type === "income" ? "text-money-positive" : "text-money-negative"
                    )}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent transactions found.</p>
              )}
            </div>
            <div className="mt-4 sm:hidden">
              <Button variant="outline" size="sm" className="w-full transition-all duration-200 hover:bg-accent">
                View All Transactions <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
