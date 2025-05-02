
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface PeriodSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  timePeriodLabels: Record<string, string>;
}

export function PeriodSelector({ value, onValueChange, timePeriodLabels }: PeriodSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
}
