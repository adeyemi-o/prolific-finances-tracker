import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Search, Trash2, UserRound, Mail, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getUsers, deleteUser, createUser, ensureUserRoles, ensureAdminUser } from "@/lib/supabase-users";
import { supabase } from "@/lib/supabase-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext"; // Add this import

// Form schema for adding users - admin only
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
});

interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
  status: string;
  lastLogin: Date | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"table" | "cards">("table");
  const isMobile = useMobile();
  const { user } = useAuth(); // Get the current logged-in user with role info
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Standard User", // Changed from "User" to "Standard User"
    },
  });
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        // Ensure prolifichcs user is set as Admin
        try {
          await ensureAdminUser("prolifichcs@gmail.com");
        } catch (error) {
          console.error("Error ensuring admin for prolifichcs:", error);
        }
        
        // Then ensure all users have the correct role in their metadata
        try {
          const updatedCount = await ensureUserRoles();
          if (updatedCount > 0) {
            console.log(`Updated roles for ${updatedCount} users`);
          }
        } catch (error) {
          console.error("Error synchronizing user roles:", error);
        }
        
        const loadedUsers = await getUsers();
        
        const formattedUsers = loadedUsers.map(user => {
          // Force prolifichcs to always show as Admin in the UI
          const role = user.email === "prolifichcs@gmail.com" 
            ? "Admin" 
            : (user.user_metadata?.role || 'Standard User');
            
          return {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
            email: user.email || 'No Email',
            role: role,
            status: user.email_confirmed_at ? 'Active' : 'Pending',
            lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
          };
        });
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Set default view based on screen size
  useEffect(() => {
    setViewType(isMobile ? "cards" : "table");
  }, [isMobile]);
  
  // Function to add user securely - calling our Edge Function instead of direct admin API
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call our secure Edge Function for user creation
      const result = await createUser({
        email: values.email,
        password: values.password,
        role: values.role,
        name: values.name
      });

      // Add to local state 
      const newUser = {
        id: result.user?.id || Date.now().toString(),
        name: values.name,
        email: values.email,
        role: values.role,
        status: "Active", // Since we auto-confirm in the edge function
        lastLogin: null,
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "User Added",
        description: `User ${values.email} has been added successfully.`,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem adding the user.",
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "User Removed",
        description: "The user has been removed from the system.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user.",
      });
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // User card view component for mobile
  const UserCard = ({ user }: { user: User }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {user.email}
              </div>
            </div>
            <Badge
              className={
                user.status === "Active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }
            >
              {user.status}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <Badge variant="outline">{user.role}</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarClock className="h-3 w-3 mr-1" />
                {user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never logged in"}
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this user? They will no longer have access to the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Manage Users</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewType === "table" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewType("table")}
              className="hidden sm:flex"
            >
              Table View
            </Button>
            <Button 
              variant={viewType === "cards" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewType("cards")}
              className="hidden sm:flex"
            >
              Card View
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Mobile Tab View Switcher */}
          <div className="sm:hidden mb-4">
            <Tabs defaultValue={viewType} onValueChange={(v) => setViewType(v as "table" | "cards")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Table View */}
          {viewType === "table" && (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Show skeleton rows while loading
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={6} className="h-10">
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                          <div className="sm:hidden flex items-center space-x-2 mt-1">
                            <Badge
                              className={
                                user.status === "Active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className={
                              user.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {user.lastLogin
                            ? user.lastLogin.toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this user? They will no longer have access to the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Remove
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Card View - Better for Mobile */}
          {viewType === "cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {loading ? (
                // Skeleton cards for loading state
                Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx} className="mb-4">
                    <CardContent className="pt-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  No users found.
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-medium mb-4">Add New User (Admin Only)</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Standard User">Standard User</SelectItem>
                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full md:w-auto">Add User</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
