import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TransactionDescriptionFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
};

export const TransactionDescriptionField = ({ form }: TransactionDescriptionFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(form.getValues("description")?.length || 0);
  
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Description</span>
          </FormLabel>
          <FormControl>
            <div className={cn(
              "relative rounded-md transition-all duration-200",
              isFocused ? "ring-2 ring-ring ring-offset-1" : "hover:ring-1 hover:ring-primary/30"
            )}>
              <Textarea
                placeholder="Enter transaction details (optional)"
                className={cn(
                  "resize-none min-h-[80px] transition-all duration-200 font-normal",
                  "focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  field.onChange(e);
                  setCharCount(e.target.value.length);
                }}
                {...field}
              />
            </div>
          </FormControl>
          <div className="flex items-center justify-between mt-1.5">
            <FormDescription>
              Add any relevant details about this transaction
            </FormDescription>
            <div className={cn(
              "text-xs text-muted-foreground transition-colors duration-200",
              charCount > 150 ? "text-amber-500" : "",
              charCount > 200 ? "text-red-500" : ""
            )}>
              {charCount}/250
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
