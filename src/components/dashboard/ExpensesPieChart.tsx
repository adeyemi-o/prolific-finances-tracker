
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// The color palette used for the pie chart slices
const COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#10B981', '#EC4899', '#F97316', '#3B82F6'];

// Helper function to format currency
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

interface ExpenseData {
  name: string;
  value: number;
}

interface ExpensesPieChartProps {
  expenseData: ExpenseData[];
  timePeriodLabel: string;
}

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

export function ExpensesPieChart({ expenseData, timePeriodLabel }: ExpensesPieChartProps) {
  const isMobile = useMobile();
  
  return (
    <Card className={`col-span-1 glass-card ${isMobile ? '' : 'hover-lift transition-all duration-300'}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-semibold">Expense Breakdown</CardTitle>
        <Badge variant="outline" className="font-normal text-xs">
          {timePeriodLabel}
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
  );
}
