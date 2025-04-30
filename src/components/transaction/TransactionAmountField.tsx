
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

type TransactionAmountFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
};

export const TransactionAmountField = ({ form }: TransactionAmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount ($)</FormLabel>
          <FormControl>
            <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
