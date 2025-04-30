
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

type TransactionTypeFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
  onTypeChange: (value: string) => void;
};

export const TransactionTypeField = ({ form, onTypeChange }: TransactionTypeFieldProps) => {
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
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
