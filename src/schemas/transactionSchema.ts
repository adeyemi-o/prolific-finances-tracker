
import * as z from "zod";

export const transactionFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  type: z.string({
    required_error: "Please select a transaction type.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    {
      message: "Amount must be a positive number.",
    }
  ),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
