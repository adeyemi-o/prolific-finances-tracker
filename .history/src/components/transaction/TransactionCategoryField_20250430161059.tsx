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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { incomeCategories, expenseCategories } from "@/constants/transactionCategories";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { Tag, TagIcon, BriefcaseIcon, HomeIcon, ShoppingCartIcon, LightbulbIcon, HeartPulseIcon, CarIcon, CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

type TransactionCategoryFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
  transactionType: string;
};

// Category icons mapping for visual representation
const categoryIcons: Record<string, React.ReactNode> = {
  // Income icons
  "Client Payment": <BriefcaseIcon className="h-4 w-4" />,
  "Insurance Reimbursement": <HeartPulseIcon className="h-4 w-4" />,
  "Government Grant": <HomeIcon className="h-4 w-4" />,
  "Donation": <HeartPulseIcon className="h-4 w-4" />,
  "Interest": <CreditCardIcon className="h-4 w-4" />,
  "Other Income": <TagIcon className="h-4 w-4" />,
  
  // Expense icons
  "Payroll": <BriefcaseIcon className="h-4 w-4" />,
  "Supplies": <ShoppingCartIcon className="h-4 w-4" />,
  "Rent": <HomeIcon className="h-4 w-4" />,
  "Utilities": <LightbulbIcon className="h-4 w-4" />,
  "Insurance": <HeartPulseIcon className="h-4 w-4" />,
  "Office Equipment": <ShoppingCartIcon className="h-4 w-4" />,
  "Vehicle Expenses": <CarIcon className="h-4 w-4" />,
  "Marketing": <TagIcon className="h-4 w-4" />,
  "Training": <BriefcaseIcon className="h-4 w-4" />,
  "Legal & Professional": <BriefcaseIcon className="h-4 w-4" />,
  "Other Expenses": <CreditCardIcon className="h-4 w-4" />,
};

export const TransactionCategoryField = ({ form, transactionType }: TransactionCategoryFieldProps) => {
  const isMobile = useMobile();
  const selectedCategory = form.watch('category');
  const categories = transactionType === "Income" ? incomeCategories : expenseCategories;
  
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={cn(
                "transition-all duration-200",
                field.value ? "border-primary/50" : "",
                "focus:ring-2 focus:ring-ring focus:ring-offset-1"
              )}>
                <SelectValue placeholder="Select category">
                  {field.value && (
                    <div className="flex items-center gap-2">
                      {categoryIcons[field.value] || <Tag className="h-4 w-4" />}
                      <span>{field.value}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent 
              className={cn(
                isMobile && "max-h-[50vh]"
              )}
              position={isMobile ? "popper" : "item-aligned"}
            >
              <SelectGroup>
                <SelectLabel className={cn(
                  "text-xs font-semibold text-muted-foreground",
                  transactionType === "Income" 
                    ? "text-green-700 dark:text-green-400" 
                    : "text-red-700 dark:text-red-400"
                )}>
                  {transactionType === "Income" ? "Income Categories" : "Expense Categories"}
                </SelectLabel>
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className={cn(
                      "transition-colors duration-200",
                      selectedCategory === category && "bg-primary/10 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {categoryIcons[category] || <Tag className="h-4 w-4" />}
                      <span>{category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
