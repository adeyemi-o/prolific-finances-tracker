import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TransactionAmountFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
};

export const TransactionAmountField = ({ form }: TransactionAmountFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const type = form.watch("type");
  
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <div className={cn(
              "relative rounded-md transition-all duration-200",
              isFocused ? "ring-2 ring-ring ring-offset-1" : "hover:ring-1 hover:ring-primary/30"
            )}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  type === "Income" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                )} />
              </div>
              <Input 
                placeholder="0.00" 
                type="number" 
                step="0.01" 
                min="0"
                className={cn(
                  "pl-8 font-medium transition-all tabular-nums tracking-tight",
                  type === "Income" ? "focus:border-green-500" : "focus:border-red-500"
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
