
// Mock data generator for transactions
export const generateMockTransactions = () => {
  const transactions = [];
  const startDate = new Date(2025, 3, 1);
  const endDate = new Date(2025, 3, 28);
  const typeOptions = ["Income", "Expense"];
  const incomeCategories = ["Client Payment", "Insurance Reimbursement", "Government Grant", "Other Income"];
  const expenseCategories = ["Payroll", "Supplies", "Rent", "Utilities", "Insurance", "Other Expenses"];
  
  for (let i = 0; i < 25; i++) {
    const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    const categories = type === "Income" ? incomeCategories : expenseCategories;
    
    transactions.push({
      id: i + 1,
      date: new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      ),
      type,
      category: categories[Math.floor(Math.random() * categories.length)],
      amount: parseFloat((Math.random() * 2000 + 500).toFixed(2)),
      description: `${type} - ${i + 1}`,
    });
  }
  
  return transactions;
};

export const mockTransactions = generateMockTransactions();

export type Transaction = {
  id: number;
  date: Date;
  type: string;
  category: string;
  amount: number;
  description: string;
};
