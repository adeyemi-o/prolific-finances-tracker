import React, { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Add debugging effect to check environment variables
  useEffect(() => {
    console.log("Environment variables check:");
    console.log("VITE_SUPABASE_URL exists:", !!import.meta.env.VITE_SUPABASE_URL);
    console.log("VITE_SUPABASE_ANON_KEY exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Log first few characters of URL for verification
    if (import.meta.env.VITE_SUPABASE_URL) {
      console.log("URL starts with:", import.meta.env.VITE_SUPABASE_URL.substring(0, 15) + "...");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-4xl w-full">
        <div className="hidden md:flex justify-center items-center">
          <img 
            src="/analysis-business-finance.svg"
            alt="Accounting illustration" 
            className="w-[500px] h-[500px] object-contain opacity-80"
          />
        </div>
        <div className="w-full max-w-md mx-auto md:mx-0">
          <div className="flex justify-center mb-8">
            <img
              src="/prolific-homecare-logo.png"
              alt="Prolific Homecare"
              className="h-16 w-auto"
            />
          </div>
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access the financial tracker
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Email"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-label="Password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
