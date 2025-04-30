
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";

type TransactionFormActionsProps = {
  form: UseFormReturn<TransactionFormValues>;
  isEditing: boolean;
};

export const TransactionFormActions = ({ form, isEditing }: TransactionFormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset();
        }}
      >
        Cancel
      </Button>
      <Button type="submit">{isEditing ? "Update" : "Save"} Transaction</Button>
    </div>
  );
};
