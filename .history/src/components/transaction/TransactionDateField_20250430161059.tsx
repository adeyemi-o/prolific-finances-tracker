import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "@/schemas/transactionSchema";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

type TransactionDateFieldProps = {
  form: UseFormReturn<TransactionFormValues>;
};

export const TransactionDateField = ({ form }: TransactionDateFieldProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMobile();
  
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal transition-all duration-200",
                    !field.value && "text-muted-foreground",
                    "hover:bg-muted/30 focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    open && "border-primary ring-2 ring-ring ring-offset-1"
                  )}
                >
                  {field.value ? (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>{format(field.value, "PPP")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Select date</span>
                    </span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className={cn(
                "w-auto p-0 border-primary/50",
                isMobile && "w-[calc(100vw-2rem)] max-w-[20rem]"
              )} 
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                initialFocus
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                className={cn(
                  "rounded-md transition-all duration-200",
                  isMobile && "w-full"
                )}
              />
              
              {/* Alternative date input for better accessibility when needed */}
              {isMobile && (
                <div className="p-3 border-t pt-3">
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        if (date) {
                          field.onChange(date);
                          setOpen(false);
                        }
                      }}
                      className="w-full"
                    />
                  </FormControl>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
