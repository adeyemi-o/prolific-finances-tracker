import React, { useState } from "react"; // Added React import for clarity
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockKeyhole, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Assuming useAuth provides a login function
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure login function is correctly implemented in AuthContext
      await login(email, password);
      navigate("/"); // Navigate to dashboard or home page on successful login
    } catch (error) {
      console.error("Login error:", error);
      // TODO: Add user-facing error handling (e.g., using a toast notification)
      // Example: toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container: Takes full screen height and centers its child vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Inner container: Grid layout for login form and accounting image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-4xl w-full">
        {/* Accounting Image Column (Hidden on mobile, visible on md screens and up) */}
        <div className="hidden md:flex justify-center items-center">
          <img 
            src="/analysis-business-finance.svg" // Replace with your accounting image in public folder
            alt="Accounting illustration" 
            className="w-[500px] h-[500px] object-contain opacity-80" // Increased width and height
          />
        </div>
        {/* Login Form Column */}
        <div className="w-full max-w-md mx-auto md:mx-0">
          {/* Logo container: Centers the logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/prolific-homecare-logo.png" // Ensure this path is correct relative to the public folder
              alt="Prolific Homecare"
              className="h-16 w-auto" // Adjust size as needed
            />
          </div>
          {/* Card component containing the form */}
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              {/* Card title and description are centered */}
              <CardTitle className="text-2xl text-center font-bold">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access the financial tracker
              </CardDescription>
            </CardHeader>
            {/* Form element */}
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Email input field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> {/* Centered icon */}
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-10" // Padding left to accommodate the icon
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Email" // Added aria-label for accessibility
                    />
                  </div>
                </div>
                {/* Password input field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> {/* Centered icon */}
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••" // Use placeholder dots for password
                      className="pl-10" // Padding left to accommodate the icon
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-label="Password" // Added aria-label for accessibility
                    />
                  </div>
                  {/* Optional: Add Forgot Password link here */}
                  {/* <div className="text-right text-sm">
                    <a href="#" className="font-medium text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
              </CardContent>
              <CardFooter>
                {/* Submit button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
             {/* Optional: Add Sign up link here */}
             {/* <div className="mt-4 text-center text-sm text-muted-foreground">
               Don't have an account?{' '}
               <a href="/signup" className="font-medium text-primary hover:underline">
                 Sign up
               </a>
             </div> */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
