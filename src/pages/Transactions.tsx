
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("list");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Transaction List</TabsTrigger>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TransactionList key={refreshTrigger} />
        </TabsContent>
        <TabsContent value="add">
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions;
