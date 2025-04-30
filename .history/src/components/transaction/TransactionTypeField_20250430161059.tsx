import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

type TransactionTypeFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
  onTypeChange: (value: string) => void;
};

export const TransactionTypeField = ({ form, onTypeChange }: TransactionTypeFieldProps) => {
  const isMobile = useMobile();
  const currentType = form.watch("type");

  // Use modern radio buttons on mobile for easier touch interaction
  if (isMobile) {
    return (
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Transaction Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  onTypeChange(value);
                }}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 transition-all duration-200",
                  field.value === "Income" ? "border-green-400/70 bg-green-50 dark:bg-green-900/20" : "hover:bg-muted/50"
                )}>
                  <RadioGroupItem value="Income" id="income" />
                  <label htmlFor="income" className="flex items-center gap-2 font-medium cursor-pointer w-full">
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    <span>Income</span>
                  </label>
                </div>
                
                <div className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 transition-all duration-200",
                  field.value === "Expense" ? "border-red-400/70 bg-red-50 dark:bg-red-900/20" : "hover:bg-muted/50"
                )}>
                  <RadioGroupItem value="Expense" id="expense" />
                  <label htmlFor="expense" className="flex items-center gap-2 font-medium cursor-pointer w-full">
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    <span>Expense</span>
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Enhanced select for desktop
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Transaction Type</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onTypeChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={cn(
                "transition-all duration-200",
                field.value === "Income" 
                  ? "border-green-400/50 data-[state=open]:border-green-500/70" 
                  : "border-red-400/50 data-[state=open]:border-red-500/70"
              )}>
                <SelectValue placeholder="Select transaction type">
                  <div className="flex items-center gap-2">
                    {field.value === "Income" ? (
                      <>
                        <ArrowUpCircle className="h-4 w-4 text-green-500" />
                        <span>Income</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownCircle className="h-4 w-4 text-red-500" />
                        <span>Expense</span>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Income" className="focus:bg-green-50 dark:focus:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-green-500" />
                  <span>Income</span>
                </div>
              </SelectItem>
              <SelectItem value="Expense" className="focus:bg-red-50 dark:focus:bg-red-900/20">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4 text-red-500" />
                  <span>Expense</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
