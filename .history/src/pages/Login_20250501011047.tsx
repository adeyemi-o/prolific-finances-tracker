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
    // Revert back to flexbox centering
    <div className="min-h-screen flex items-center justify-center bg-background p-4 border-4 border-red-500">
      {/* Simplified inner content for debugging */}
      <div className="bg-card p-8 rounded shadow-lg border-2 border-blue-500">
        <h1 className="text-xl text-center text-foreground">Login Form Area</h1>
        <p className="text-center text-muted-foreground">Is this centered?</p>
      </div>
    </div>
  );
};

export default Login;
