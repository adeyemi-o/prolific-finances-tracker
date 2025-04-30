import { Edit, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMobile, useTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Transaction = {
  id: number;
  date: Date;
  type: string;
  category: string;
  amount: number;
  description: string;
};

type TransactionTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => Promise<void>;
};

export const TransactionTable = ({ transactions, onEdit, onDelete }: TransactionTableProps) => {
  const isMobile = useMobile();
  const isTablet = useTablet();

  // Render a mobile-optimized view for small screens
  if (isMobile) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-300">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={cn(
                "border rounded-lg p-4 space-y-3 transition-all duration-300",
                "hover:shadow-md hover:border-border/80",
                "bg-card/50 backdrop-blur-sm"
              )}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{transaction.date.toLocaleDateString()}</div>
                  <Badge 
                    className={cn(
                      "mt-1.5 transition-all duration-200",
                      transaction.type === "Income"
                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    )}
                  >
                    {transaction.type}
                  </Badge>
                </div>
                <span 
                  className={cn(
                    "font-bold text-lg tabular-nums",
                    transaction.type === "Income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {transaction.type === "Income" ? "+" : "-"}
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="grid gap-1">
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium">{transaction.category}</div>
              </div>
              
              {transaction.description && (
                <div className="grid gap-1">
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="text-sm">{transaction.description}</div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  className="h-8 transition-all duration-200 hover:shadow-sm"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 h-8 transition-all duration-200 hover:bg-red-50 hover:shadow-sm dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700 transition-all duration-200"
                        onClick={() => onDelete(transaction.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <div className="h-32 flex items-center justify-center border rounded-lg bg-card/50 backdrop-blur-sm animate-in fade-in-50 duration-300">
            <p className="text-center text-muted-foreground flex flex-col items-center gap-2">
              <ArrowUpDown className="h-5 w-5 opacity-60" />
              <span>No transactions found.</span>
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // Tablet view - optimized experience between mobile and desktop
  if (isTablet) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in-50 duration-300">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={cn(
                "border rounded-lg p-4 space-y-3 transition-all duration-300",
                "hover:shadow-md hover:border-border/80",
                "bg-card/50 backdrop-blur-sm"
              )}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{transaction.date.toLocaleDateString()}</div>
                  <Badge 
                    className={cn(
                      "mt-1.5 transition-all duration-200",
                      transaction.type === "Income"
                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    )}
                  >
                    {transaction.type}
                  </Badge>
                </div>
                <span 
                  className={cn(
                    "font-bold text-lg tabular-nums",
                    transaction.type === "Income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {transaction.type === "Income" ? "+" : "-"}
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-1">
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-medium">{transaction.category}</div>
                </div>
                
                {transaction.description && (
                  <div>
                    <div className="text-sm text-muted-foreground">Description</div>
                    <div className="text-sm line-clamp-2">{transaction.description}</div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  className="h-8 transition-all duration-200 hover:shadow-sm"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 h-8 transition-all duration-200 hover:bg-red-50 hover:shadow-sm dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700 transition-all duration-200"
                        onClick={() => onDelete(transaction.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <div className="h-32 col-span-2 flex items-center justify-center border rounded-lg bg-card/50 backdrop-blur-sm animate-in fade-in-50 duration-300">
            <p className="text-center text-muted-foreground flex flex-col items-center gap-2">
              <ArrowUpDown className="h-5 w-5 opacity-60" />
              <span>No transactions found.</span>
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // Desktop view with enhanced data table
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm animate-in fade-in-50 duration-300">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/30">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="text-right font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right font-semibold w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow 
                  key={transaction.id}
                  className="group transition-colors hover:bg-muted/30"
                  style={{
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <TableCell className="font-medium">
                    {transaction.date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "transition-all duration-200",
                        transaction.type === "Income"
                          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                          : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      )}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    <span 
                      className={cn(
                        transaction.type === "Income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {transaction.type === "Income" ? "+" : "-"}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 transition-all duration-200 hover:bg-background"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transaction? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700 transition-all duration-200"
                              onClick={() => onDelete(transaction.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <p className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ArrowUpDown className="h-5 w-5 opacity-60" />
                    <span>No transactions found.</span>
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
