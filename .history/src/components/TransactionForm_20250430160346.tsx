import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { transactionFormSchema, TransactionFormValues } from "@/schemas/transactionSchema";
import { TransactionDateField } from "./transaction/TransactionDateField";
import { TransactionTypeField } from "./transaction/TransactionTypeField";
import { TransactionCategoryField } from "./transaction/TransactionCategoryField";
import { TransactionAmountField } from "./transaction/TransactionAmountField";
import { TransactionDescriptionField } from "./transaction/TransactionDescriptionField";
import { TransactionFormActions } from "./transaction/TransactionFormActions";
import { addTransaction, updateTransaction } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useMobile, useTablet } from "@/hooks/use-mobile";
import { FileCheck, FileEdit } from "lucide-react";

type TransactionFormProps = {
  onTransactionAdded: () => void;
  editData?: any;
};

const TransactionForm = ({ onTransactionAdded, editData }: TransactionFormProps) => {
  const [transactionType, setTransactionType] = useState(editData?.type || "Income");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();
  
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

  // Add animation when form loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (values: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      const transactionData = {
        date: values.date.toISOString().split('T')[0],
        type: values.type,
        category: values.category,
        amount: parseFloat(values.amount),
        description: values.description,
      };

      if (editData) {
        // Update existing transaction
        await updateTransaction(String(editData.id), transactionData);
        toast({
          title: "Transaction Updated",
          description: "Your transaction has been successfully updated.",
        });
      } else {
        // Add new transaction
        await addTransaction(transactionData);
        toast({
          title: "Transaction Added",
          description: "Your transaction has been successfully recorded.",
        });
      }
      
      form.reset({
        date: new Date(),
        type: "Income",
        category: "",
        amount: "",
        description: "",
      });
      
      onTransactionAdded();
    } catch (error) {
      console.error("Error adding/updating transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem recording your transaction.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    form.setValue("category", "");
  };

  return (
    <Card className={cn(
      "glass-card shadow-sm border-border/80 overflow-hidden transition-all duration-500",
      formLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <CardHeader className="pb-2 space-y-1.5">
        <div className="flex items-center gap-2">
          {editData ? (
            <FileEdit className="h-5 w-5 text-primary" />
          ) : (
            <FileCheck className="h-5 w-5 text-primary" />
          )}
          <CardTitle>
            {editData ? "Edit Transaction" : "Add New Transaction"}
          </CardTitle>
        </div>
        <CardDescription>
          {editData 
            ? "Update the details of your existing transaction" 
            : "Record a new financial transaction in your accounts"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : 
              isTablet ? "grid-cols-2" : 
              "grid-cols-1 md:grid-cols-2"
            )}>
              <div className={cn(
                "space-y-6", 
                !isMobile && !isTablet && "col-span-2 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-6"
              )}>
                <div className={cn(!isMobile && !isTablet && "flex-1")}>
                  <TransactionDateField form={form} />
                </div>
                <div className={cn(!isMobile && !isTablet && "flex-1")}>
                  <TransactionTypeField form={form} onTypeChange={handleTypeChange} />
                </div>
              </div>
              
              <TransactionCategoryField form={form} transactionType={transactionType} />
              <TransactionAmountField form={form} />
            </div>

            <TransactionDescriptionField form={form} />
            <div className="pt-2">
              <TransactionFormActions form={form} isEditing={!!editData} isSubmitting={isSubmitting} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
