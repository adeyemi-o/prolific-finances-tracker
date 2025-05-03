import { useState, useEffect } from "react";
import { getTransactions } from "@/lib/supabase-transactions";
import { parseISO, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Define Transaction type based on expected Supabase structure
interface Transaction {
  id: number | string;
  created_at: string; 
  date: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  description?: string | null;
}

// Local interface for processed transactions 
export interface ProcessedTransaction {
  id: number | string;
  date: Date;  // Use Date objects
  type: "Income" | "Expense";
  category: string;
  amount: number;
  description: string;
  created_at?: string;
}

export interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueChange: number | null;
  expenseChange: number | null;
  netProfitChange: number | null;
}

export interface ExpenseData {
  name: string;
  value: number;
}

export interface MonthlyData {
  name: string;
  revenue: number;
  expenses: number;
}

export interface RecentTransaction {
  id: number;
  name: string;
  date: Date;  // Use Date objects consistently
  amount: number;
  type: string;
}

export function useDashboardData(timePeriod: string) {
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const rawData = await getTransactions();
        
        // Transform string dates into actual Date objects
        const formattedTransactions: ProcessedTransaction[] = (rawData as Transaction[]).map(item => ({
          id: item.id,
          date: parseISO(item.date), // Convert string date to Date object
          type: item.type,
          category: item.category,
          amount: item.amount,
          description: item.description || '',
          created_at: item.created_at
        }));
        
        setTransactions(formattedTransactions);
        processData(formattedTransactions, timePeriod);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error Loading Data",
          description: "Could not fetch transaction data for the dashboard.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, timePeriod]);

  const processData = (data: ProcessedTransaction[], period: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    let prevStartDate: Date;
    let prevEndDate: Date;

    // Set date ranges based on time period
    switch (period) {
      case "1m":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 1, prevEndDate.getDate());
        break;
      case "3m":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 3, prevEndDate.getDate());
        break;
      case "ytd":
        startDate = new Date(now.getFullYear(), 0, 1);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear() - 1, 0, 1);
        break;
      case "all":
        startDate = new Date(0);
        prevStartDate = new Date(0);
        prevEndDate = new Date(0);
        break;
      case "6m":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 6, prevEndDate.getDate());
        break;
    }

    // Compare Date objects for filtering
    const currentPeriodTransactions = data.filter(tx => 
      tx.date >= startDate && tx.date <= endDate);
      
    const previousPeriodTransactions = period !== 'all' 
      ? data.filter(tx => tx.date >= prevStartDate && tx.date <= prevEndDate) 
      : [];

    // Calculate financial metrics
    let currentPeriodRevenue = 0;
    let currentPeriodExpenses = 0;
    let previousPeriodRevenue = 0;
    let previousPeriodExpenses = 0;

    currentPeriodTransactions.forEach(tx => {
      if (tx.type === 'Income') {
        currentPeriodRevenue += tx.amount;
      } else if (tx.type === 'Expense') {
        currentPeriodExpenses += tx.amount;
      }
    });

    previousPeriodTransactions.forEach(tx => {
      if (tx.type === 'Income') {
        previousPeriodRevenue += tx.amount;
      } else if (tx.type === 'Expense') {
        previousPeriodExpenses += tx.amount;
      }
    });

    const currentPeriodNetProfit = currentPeriodRevenue - currentPeriodExpenses;
    const previousPeriodNetProfit = previousPeriodRevenue - previousPeriodExpenses;

    const totalRevenue = currentPeriodRevenue;
    const totalExpenses = currentPeriodExpenses;
    const netProfit = currentPeriodNetProfit;

    const calculateChange = (current: number, previous: number): number | null => {
      if (period === 'all') return null;
      if (previous === 0) {
        return current === 0 ? 0 : null;
      }
      return ((current - previous) / previous) * 100;
    };

    const revenueChange = calculateChange(currentPeriodRevenue, previousPeriodRevenue);
    const expenseChange = calculateChange(currentPeriodExpenses, previousPeriodExpenses);
    let netProfitChange: number | null = null;
    if (period !== 'all') {
      if (previousPeriodNetProfit !== 0) {
        netProfitChange = ((currentPeriodNetProfit - previousPeriodNetProfit) / Math.abs(previousPeriodNetProfit)) * 100;
      } else if (currentPeriodNetProfit !== 0) {
        netProfitChange = null;
      } else {
        netProfitChange = 0;
      }
    }

    setSummaryData({
      totalRevenue,
      totalExpenses,
      netProfit,
      revenueChange,
      expenseChange,
      netProfitChange
    });

    // Process expenses by category
    const expensesByCategory: Record<string, number> = {};
    currentPeriodTransactions
      .filter(tx => tx.type === 'Expense')
      .forEach(tx => {
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      });
    const formattedExpenseData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    setExpenseData(formattedExpenseData);

    // Process monthly data for charts
    const monthlyAgg: Record<string, { revenue: number; expenses: number }> = {};
    const sixMonthsAgoChart = new Date();
    sixMonthsAgoChart.setMonth(sixMonthsAgoChart.getMonth() - 5);
    sixMonthsAgoChart.setDate(1);
    sixMonthsAgoChart.setHours(0, 0, 0, 0);

    data.filter(tx => tx.date >= sixMonthsAgoChart).forEach(tx => {
      const monthYear = format(tx.date, 'MMM yyyy');
      if (!monthlyAgg[monthYear]) {
        monthlyAgg[monthYear] = { revenue: 0, expenses: 0 };
      }
      if (tx.type === 'Income') {
        monthlyAgg[monthYear].revenue += tx.amount;
      } else if (tx.type === 'Expense') {
        monthlyAgg[monthYear].expenses += tx.amount;
      }
    });

    const sortedMonthlyData = Object.entries(monthlyAgg)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    setMonthlyData(sortedMonthlyData);

    // Process recent transactions
    const sortedTransactions = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());
    const formattedRecent = sortedTransactions.slice(0, 5).map(tx => ({
      id: typeof tx.id === 'string' ? parseInt(tx.id, 10) : tx.id as number,
      name: tx.description || tx.category,
      date: tx.date, // Already a Date object
      amount: tx.amount,
      type: tx.type.toLowerCase()
    }));
    setRecentTransactions(formattedRecent);
  };

  return {
    isLoading,
    error,
    summaryData,
    expenseData,
    monthlyData,
    recentTransactions
  };
}
