
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editData, setEditData] = useState(null);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("list");
    setEditData(null);
  };
  
  const handleEditTransaction = (transaction) => {
    setEditData(transaction);
    setActiveTab("add");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Transaction List</TabsTrigger>
          <TabsTrigger value="add">{editData ? "Edit Transaction" : "Add Transaction"}</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TransactionList 
            key={refreshTrigger} 
            onEditTransaction={handleEditTransaction}
          />
        </TabsContent>
        <TabsContent value="add">
          <TransactionForm 
            onTransactionAdded={handleTransactionAdded} 
            editData={editData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions;
