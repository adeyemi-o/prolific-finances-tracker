
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signUp = async (email: string, password: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    return null;
  }
  
  return data.user;
};

// Session hook
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    return null;
  }
  
  return data.session;
};

// Transaction functions
export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data || [];
};

export const addTransaction = async (transaction: {
  date: string;
  type: string;
  category: string;
  amount: number;
  description?: string;
}) => {
  const { error } = await supabase.from('transactions').insert([transaction]);
  
  if (error) {
    throw error;
  }
  
  return true;
};

export const updateTransaction = async (id: string, transaction: {
  date?: string;
  type?: string;
  category?: string;
  amount?: number;
  description?: string;
}) => {
  const { error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id);
    
  if (error) {
    throw error;
  }
  
  return true;
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return true;
};

// User management functions
export const getUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    throw error;
  }
  
  return data.users || [];
};

export const createUser = async (user: { email: string; password: string; role: string }) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    user_metadata: { role: user.role },
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.auth.admin.deleteUser(id);
  
  if (error) {
    throw error;
  }
  
  return true;
};

// Helper to seed transactions data
export const seedTransactions = async () => {
  const seedData = [
    { date: '2024-12-31', type: 'Income', category: 'Client Service Revenue', amount: 380000, description: 'Revenue from client services' },
    { date: '2024-12-31', type: 'Income', category: 'Cash Client Revenue', amount: 21000, description: 'Cash payments from clients' },
    { date: '2024-12-31', type: 'Expense', category: 'Caregivers Salaries & Wages', amount: 269000, description: 'Salaries and wages for caregivers' },
    { date: '2024-12-31', type: 'Expense', category: 'Payroll Taxes & Benefits', amount: 16000, description: 'Payroll taxes and employee benefits' },
    { date: '2024-12-31', type: 'Expense', category: 'Payroll Fees', amount: 3719.82, description: 'Fees for payroll processing' },
    { date: '2024-12-31', type: 'Expense', category: 'Transportation Expenses', amount: 1200, description: 'Transportation costs for services' },
    { date: '2024-12-31', type: 'Expense', category: 'Insurance', amount: 9440, description: 'Liability, bond, and workers compensation insurance' },
    { date: '2024-12-31', type: 'Expense', category: 'Office Rent & Utilities', amount: 3700, description: 'Office rent and utility expenses' },
    { date: '2024-12-31', type: 'Expense', category: 'Administrative Staff Salaries', amount: 6500, description: 'Salaries for administrative staff' },
    { date: '2024-12-31', type: 'Expense', category: 'Marketing & Advertising', amount: 9200, description: 'Marketing, advertising, and web hosting costs' },
    { date: '2024-12-31', type: 'Expense', category: 'Office Supplies & Software', amount: 1800, description: 'Office supplies and software subscriptions' },
    { date: '2024-12-31', type: 'Expense', category: 'Legal & Professional Fees', amount: 7000, description: 'Legal and professional services fees' },
    { date: '2024-12-31', type: 'Expense', category: 'Training & Development', amount: 3500, description: 'Staff training and development costs' },
    { date: '2024-12-31', type: 'Expense', category: 'Bonus & Gifts', amount: 3600, description: 'Bonuses and gifts for staff' },
    { date: '2024-12-31', type: 'Expense', category: 'Miscellaneous Expenses', amount: 2000, description: 'Miscellaneous operating expenses' },
    { date: '2024-12-31', type: 'Expense', category: 'Loan Interest', amount: 2383.67, description: 'Interest on loans' },
    { date: '2024-12-31', type: 'Expense', category: 'Car Payment & Insurance', amount: 10741.32, description: 'Car payments and insurance costs' }
  ];

  const { error } = await supabase.from('transactions').insert(seedData);
  
  if (error) {
    throw error;
  }
  
  return true;
};
