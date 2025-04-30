
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionListFilters } from "./TransactionListFilters";
import { TransactionTable } from "./TransactionTable";
import { TransactionPagination } from "./TransactionPagination";
import { Transaction } from "./TransactionMockData";
import { getTransactions, deleteTransaction } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type TransactionListProps = {
  onEditTransaction: (transaction: Transaction) => void;
};

const TransactionList = ({ onEditTransaction }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTransactions();
        // Convert the data to the Transaction format
        const formattedData = data.map(item => ({
          id: item.id,
          date: new Date(item.date),
          type: item.type,
          category: item.category,
          amount: item.amount,
          description: item.description
        }));
        setTransactions(formattedData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [toast]);
  
  // Filter transactions based on search term and filter type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType =
      filterType === "All" || transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(String(id));
      
      // Update the local state
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the transaction. Please try again.",
      });
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-10">
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionListFilters
            searchTerm={searchTerm}
            filterType={filterType}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
          
          <TransactionTable 
            transactions={currentItems}
            onEdit={onEditTransaction}
            onDelete={handleDeleteTransaction}
          />
          
          {filteredTransactions.length > itemsPerPage && (
            <TransactionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;
