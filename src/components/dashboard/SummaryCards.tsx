
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueChange: number | null;
  expenseChange: number | null;
  netProfitChange: number | null;
}

interface SummaryCardsProps {
  summaryData: SummaryData;
  timePeriodLabel: string;
}

// Helper function to format currency
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

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

export function SummaryCards({ summaryData, timePeriodLabel }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in-normal">
      <Card className="glass-card hover-lift transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Total Revenue ({timePeriodLabel})
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
            Total Expenses ({timePeriodLabel})
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
            Net Profit ({timePeriodLabel})
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
  );
}
