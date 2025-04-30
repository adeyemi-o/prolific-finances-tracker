
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { transactionFormSchema, TransactionFormValues } from "@/schemas/transactionSchema";
import { TransactionDateField } from "./transaction/TransactionDateField";
import { TransactionTypeField } from "./transaction/TransactionTypeField";
import { TransactionCategoryField } from "./transaction/TransactionCategoryField";
import { TransactionAmountField } from "./transaction/TransactionAmountField";
import { TransactionDescriptionField } from "./transaction/TransactionDescriptionField";
import { TransactionFormActions } from "./transaction/TransactionFormActions";

type TransactionFormProps = {
  onTransactionAdded: () => void;
  editData?: any;
};

const TransactionForm = ({ onTransactionAdded, editData }: TransactionFormProps) => {
  const [transactionType, setTransactionType] = useState(editData?.type || "Income");
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: editData?.date ? new Date(editData.date) : new Date(),
      type: editData?.type || "Income",
      category: editData?.category || "",
      amount: editData?.amount ? String(editData.amount) : "",
      description: editData?.description || "",
    },
  });

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      // This would connect to Supabase in the real implementation
      console.log("Submitting transaction:", values);
      
      // Simulate success
      toast({
        title: "Transaction Added",
        description: "Your transaction has been successfully recorded.",
      });
      
      form.reset({
        date: new Date(),
        type: "Income",
        category: "",
        amount: "",
        description: "",
      });
      
      onTransactionAdded();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem recording your transaction.",
      });
    }
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    form.setValue("category", "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editData ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TransactionDateField form={form} />
              <TransactionTypeField form={form} onTypeChange={handleTypeChange} />
              <TransactionCategoryField form={form} transactionType={transactionType} />
              <TransactionAmountField form={form} />
            </div>

            <TransactionDescriptionField form={form} />
            <TransactionFormActions form={form} isEditing={!!editData} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
