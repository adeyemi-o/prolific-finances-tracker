
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";

interface MonthlyData {
  name: string;
  revenue: number;
  expenses: number;
}

interface RevenueExpensesChartProps {
  monthlyData: MonthlyData[];
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

export function RevenueExpensesChart({ monthlyData }: RevenueExpensesChartProps) {
  const isMobile = useMobile();
  
  return (
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
  );
}
