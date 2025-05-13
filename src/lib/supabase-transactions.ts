import { supabase } from './supabase-client';
import { logAuditEvent } from './audit-logger';

/**
 * Gets all transactions, ordered by date
 * @returns Array of transactions
 */
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

/**
 * Adds a new transaction
 * @param transaction Transaction data
 * @returns True if successful
 */
export const addTransaction = async (transaction: {
  date: string;
  type: string;
  category: string;
  amount: number;
  description?: string;
}) => {
  let outcome = 'success';
  try {
    const { error, data } = await supabase.from('transactions').insert([transaction]).select();
    if (error) {
      outcome = 'failure';
      throw error;
    }
    // Log audit event
    await logAuditEvent({
      event_type: 'create',
      resource: 'transaction',
      resource_id: data && data[0] && data[0].id ? String(data[0].id) : undefined,
      previous_state: null,
      new_state: transaction,
      outcome,
    });
    return true;
  } catch (error) {
    // Log failure
    await logAuditEvent({
      event_type: 'create',
      resource: 'transaction',
      resource_id: undefined,
      previous_state: null,
      new_state: transaction,
      outcome: 'failure',
    });
    throw error;
  }
};

/**
 * Updates an existing transaction
 * @param id Transaction ID
 * @param transaction Transaction data to update
 * @returns True if successful
 */
export const updateTransaction = async (id: string, transaction: {
  date?: string;
  type?: string;
  category?: string;
  amount?: number;
  description?: string;
}) => {
  let outcome = 'success';
  let previous_state = null;
  try {
    // Fetch previous state
    const { data: prevData, error: prevError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (prevError) {
      outcome = 'failure';
      throw prevError;
    }
    previous_state = prevData;
    const { error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id);
    if (error) {
      outcome = 'failure';
      throw error;
    }
    // Log audit event
    await logAuditEvent({
      event_type: 'update',
      resource: 'transaction',
      resource_id: id,
      previous_state,
      new_state: transaction,
      outcome,
    });
    return true;
  } catch (error) {
    // Log failure
    await logAuditEvent({
      event_type: 'update',
      resource: 'transaction',
      resource_id: id,
      previous_state,
      new_state: transaction,
      outcome: 'failure',
    });
    throw error;
  }
};

/**
 * Deletes a transaction
 * @param id Transaction ID
 * @returns True if successful
 */
export const deleteTransaction = async (id: string) => {
  let outcome = 'success';
  let previous_state = null;
  try {
    // Fetch previous state
    const { data: prevData, error: prevError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (prevError) {
      outcome = 'failure';
      throw prevError;
    }
    previous_state = prevData;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      outcome = 'failure';
      throw error;
    }
    // Log audit event
    await logAuditEvent({
      event_type: 'delete',
      resource: 'transaction',
      resource_id: id,
      previous_state,
      new_state: null,
      outcome,
    });
    return true;
  } catch (error) {
    // Log failure
    await logAuditEvent({
      event_type: 'delete',
      resource: 'transaction',
      resource_id: id,
      previous_state,
      new_state: null,
      outcome: 'failure',
    });
    throw error;
  }
};

/**
 * Gets transactions within a specific date range
 * @param startDate Start date (inclusive)
 * @param endDate End date (inclusive)
 * @returns Array of transactions within the date range
 */
export const getTransactionsByDateRange = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate) // Greater than or equal to start date
    .lte('date', endDate)   // Less than or equal to end date
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions by date range:', error);
    throw error;
  }

  return data || [];
};

/**
 * Seeds the transactions table with sample data
 * @returns True if successful
 */
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
