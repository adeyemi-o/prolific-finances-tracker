
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
import { incomeCategories, expenseCategories } from "@/constants/transactionCategories";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";

type TransactionCategoryFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
  transactionType: string;
};

export const TransactionCategoryField = ({ form, transactionType }: TransactionCategoryFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {transactionType === "Income"
                ? incomeCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                : expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
