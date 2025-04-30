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

// Mock data - replace with real data from Supabase
const summaryData = {
  totalRevenue: 128750.45,
  totalExpenses: 87320.95,
  netProfit: 41429.50,
  revenueChange: 12.5,
  expensesChange: 8.2,
  profitChange: 16.8
};

const expenseData = [
  { name: "Payroll", value: 45000 },
  { name: "Supplies", value: 15000 },
  { name: "Rent", value: 12000 },
  { name: "Utilities", value: 5000 },
  { name: "Insurance", value: 7000 },
  { name: "Other", value: 3320.95 }
];

const monthlyData = [
  { name: "Jan", revenue: 18500, expenses: 12800 },
  { name: "Feb", revenue: 19200, expenses: 13100 },
  { name: "Mar", revenue: 21000, expenses: 14200 },
  { name: "Apr", revenue: 22500, expenses: 15000 },
  { name: "May", revenue: 23800, expenses: 15400 },
  { name: "Jun", revenue: 24750, expenses: 16820 }
];

const recentTransactions = [
  { id: 1, name: "Client Payment - ABC Home Health", date: new Date(2025, 3, 28), amount: 2346.78, type: "income" },
  { id: 2, name: "Vendor Payment - Medical Supplies Inc", date: new Date(2025, 3, 27), amount: 876.54, type: "expense" },
  { id: 3, name: "Client Payment - Smith Family Care", date: new Date(2025, 3, 26), amount: 1895.00, type: "income" },
  { id: 4, name: "Staff Payroll", date: new Date(2025, 3, 25), amount: 3250.00, type: "expense" },
  { id: 5, name: "Insurance Payment", date: new Date(2025, 3, 24), amount: 1250.00, type: "expense" }
];

const COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

const Dashboard = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Format $ amounts with proper formatting
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className={cn(
      "space-y-6 transition-opacity duration-500",
      isLoaded ? "opacity-100" : "opacity-0"
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
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Badge variant="outline" className={cn(
                "font-medium flex items-center gap-1 mr-2",
                summaryData.revenueChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {summaryData.revenueChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(summaryData.revenueChange)}%
              </Badge>
              <span>from last month</span>
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
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Badge variant="outline" className={cn(
                "font-medium flex items-center gap-1 mr-2",
                summaryData.expensesChange <= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {summaryData.expensesChange <= 0 ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                {Math.abs(summaryData.expensesChange)}%
              </Badge>
              <span>from last month</span>
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
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Badge variant="outline" className={cn(
                "font-medium flex items-center gap-1 mr-2",
                summaryData.profitChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {summaryData.profitChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(summaryData.profitChange)}%
              </Badge>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 animate-in-normal" style={{ animationDelay: '100ms' }}>
        {isMobile ? (
          // Mobile-optimized chart view
          <Card className="col-span-1 glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Expense Breakdown</CardTitle>
              <Badge variant="outline" className="font-normal text-xs">
                This month
              </Badge>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
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
            </CardContent>
          </Card>
        ) : (
          // Desktop chart view
          <Card className="col-span-1 glass-card hover-lift transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Expense Breakdown</CardTitle>
                <CardDescription>Monthly expense categories</CardDescription>
              </div>
              <Badge variant="outline" className="font-normal">
                This month
              </Badge>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1000}
                      animationBegin={200}
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
                    <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="col-span-1 glass-card hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Revenue vs Expenses</CardTitle>
              <CardDescription>Last 6 months comparison</CardDescription>
            </div>
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
            <div>
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-accent hidden sm:flex">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, i) => (
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
              ))}
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
