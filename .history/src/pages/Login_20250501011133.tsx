import React, { useState } from "react"; // Added React import for clarity
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    // Outer container - needs to be relative for absolute positioning of child
    <div className="relative min-h-screen bg-background p-4 border-4 border-red-500">
      {/* Inner content - positioned absolutely */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-8 rounded shadow-lg border-2 border-blue-500 w-full max-w-md">
        <h1 className="text-xl text-center text-foreground">Login Form Area</h1>
        <p className="text-center text-muted-foreground">Is this centered now?</p>
      </div>
    </div>
  );
};

export default Login;
