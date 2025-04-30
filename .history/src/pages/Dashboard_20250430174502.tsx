import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMobile, useTablet } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { getTransactions } from "@/lib/supabase";
import { Transaction } from "@/components/transaction-list/TransactionMockData";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
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

const COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const rawData = await getTransactions();
        const formattedTransactions: Transaction[] = rawData.map(item => ({
          id: item.id,
          date: new Date(item.date),
          type: item.type,
          category: item.category,
          amount: item.amount,
          description: item.description || ''
        }));
        setTransactions(formattedTransactions);
        processData(formattedTransactions);
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
  }, [toast]);

  const processData = (data: Transaction[]) => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    data.forEach(tx => {
      if (tx.type === 'Income') {
        totalRevenue += tx.amount;
      } else if (tx.type === 'Expense') {
        totalExpenses += tx.amount;
      }
    });
    const netProfit = totalRevenue - totalExpenses;
    setSummaryData({ totalRevenue, totalExpenses, netProfit });

    const expensesByCategory: Record<string, number> = {};
    data.filter(tx => tx.type === 'Expense').forEach(tx => {
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
    });
    const formattedExpenseData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    setExpenseData(formattedExpenseData);

    const monthlyAgg: Record<string, { revenue: number; expenses: number }> = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    data.filter(tx => tx.date >= sixMonthsAgo).forEach(tx => {
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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
            Get a snapshot of your financial performance
          </p>
        </div>
        <div className="flex items-center bg-muted/50 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm text-muted-foreground border border-border/50">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in-normal">
        <Card className="glass-card hover-lift transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold amount-display">
              {formatCurrency(summaryData.totalRevenue)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold amount-display">
              {formatCurrency(summaryData.totalExpenses)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold amount-display">
              {formatCurrency(summaryData.netProfit)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 animate-in-normal" style={{ animationDelay: '100ms' }}>
        <Card className={`col-span-1 glass-card ${isMobile ? '' : 'hover-lift transition-all duration-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-semibold">Expense Breakdown</CardTitle>
            <Badge variant="outline" className="font-normal text-xs">
              This month
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={isMobile ? "h-[250px] mt-4" : "h-[300px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                    label={isMobile ? ({ name, percent }) => 
                      percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '' 
                      : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))} 
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  {!isMobile && <Legend formatter={(value) => <span className="text-sm">{value}</span>} />}
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {isMobile && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {expenseData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex justify-between w-full">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium tabular-nums">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 glass-card hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Revenue vs Expenses</CardTitle>
            <CardDescription>Last 6 months comparison</CardDescription>
            <Badge variant="outline" className="font-normal">
              6 months
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {isMobile ? (
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 20, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis width={40} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Expenses" />
                  </LineChart>
                ) : (
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis width={60} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
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
