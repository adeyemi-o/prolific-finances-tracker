
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface RecentTransaction {
  id: number;
  name: string;
  date: Date;
  amount: number;
  type: string;
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
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

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const navigate = useNavigate();

  return (
    <Card className="glass-card hover-lift transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
        <Button
          variant="outline"
          size="sm"
          className="transition-all duration-200 hover:bg-accent hidden sm:flex"
          onClick={() => navigate("/transactions")}
        >
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction, i) => (
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
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full transition-all duration-200 hover:bg-accent"
            onClick={() => navigate("/transactions")}
          >
            View All Transactions <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
