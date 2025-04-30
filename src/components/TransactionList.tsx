
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionListFilters } from "./transaction-list/TransactionListFilters";
import { TransactionTable } from "./transaction-list/TransactionTable";
import { TransactionPagination } from "./transaction-list/TransactionPagination";
import { mockTransactions, Transaction } from "./transaction-list/TransactionMockData";

type TransactionListProps = {
  onEditTransaction: (transaction: Transaction) => void;
};

const TransactionList = ({ onEditTransaction }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter transactions based on search term and filter type
  const filteredTransactions = mockTransactions.filter((transaction) => {
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
