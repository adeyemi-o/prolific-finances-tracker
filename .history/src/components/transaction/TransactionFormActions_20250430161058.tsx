import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { Loader2, Save, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

type TransactionFormActionsProps = {
  form: UseFormReturn<TransactionFormValues>;
  isEditing: boolean;
  isSubmitting: boolean;
};

export const TransactionFormActions = ({ form, isEditing, isSubmitting }: TransactionFormActionsProps) => {
  const isMobile = useMobile();
  
  return (
    <div className={cn(
      "flex items-center gap-3 transition-all duration-200",
      isMobile ? "flex-col w-full" : "justify-end"
    )}>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset();
        }}
        disabled={isSubmitting}
        className={cn(
          "transition-all duration-200",
          isMobile && "w-full order-2",
          !isSubmitting && "hover:bg-muted/80 hover:border-border"
        )}
      >
        {isMobile ? (
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Form
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </span>
        )}
      </Button>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={cn(
          "transition-all duration-200",
          isMobile && "w-full order-1",
          !isSubmitting && "hover:bg-primary/90"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Saving..."}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />
            {isEditing ? "Update" : "Save"} Transaction
          </span>
        )}
      </Button>
    </div>
  );
};
