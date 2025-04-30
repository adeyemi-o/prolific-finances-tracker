
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { Loader2 } from "lucide-react";

type TransactionFormActionsProps = {
  form: UseFormReturn<TransactionFormValues>;
  isEditing: boolean;
  isSubmitting: boolean;
};

export const TransactionFormActions = ({ form, isEditing, isSubmitting }: TransactionFormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset();
        }}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Saving..."}
          </>
        ) : (
          <>{isEditing ? "Update" : "Save"} Transaction</>
        )}
      </Button>
    </div>
  );
};
