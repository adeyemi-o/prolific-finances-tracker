
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTablet } from "@/hooks/use-mobile";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensesPieChart } from "@/components/dashboard/ExpensesPieChart";
import { RevenueExpensesChart } from "@/components/dashboard/RevenueExpensesChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const isTablet = useTablet();
  const [timePeriod, setTimePeriod] = useState<string>("6m");

  const timePeriodLabels: Record<string, string> = {
    "1m": "Last Month",
    "3m": "Last 3 Months",
    "6m": "Last 6 Months",
    "ytd": "Year to Date",
    "all": "All Time",
  };

  const { 
    isLoading, 
    error, 
    summaryData, 
    expenseData,
    monthlyData,
    recentTransactions 
  } = useDashboardData(timePeriod);

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
          <PeriodSelector 
            value={timePeriod}
            onValueChange={setTimePeriod}
            timePeriodLabels={timePeriodLabels}
          />
        </div>
      </div>
      
      <SummaryCards 
        summaryData={summaryData} 
        timePeriodLabel={timePeriodLabels[timePeriod]} 
      />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 animate-in-normal" style={{ animationDelay: '100ms' }}>
        <ExpensesPieChart 
          expenseData={expenseData} 
          timePeriodLabel={timePeriodLabels[timePeriod]} 
        />
        <RevenueExpensesChart monthlyData={monthlyData} />
      </div>
      
      <div className="animate-in-normal" style={{ animationDelay: '200ms' }}>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
