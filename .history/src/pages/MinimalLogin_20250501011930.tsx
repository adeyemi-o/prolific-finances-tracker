import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react'; // Import Lottie
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Import from the new location within src/assets
import loginAnimationData from '@/assets/login-animation.json';

const MinimalLogin = () => {
  // ... existing state and functions ...

  return (
    // Use a grid layout for desktop, centering content
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-4xl w-full">
        {/* Login Form Column */}
        <div className="w-full max-w-xs space-y-6 mx-auto md:mx-0">
          {/* Optional: Logo or Title */}
          <div className="text-center">
            <img
              src="/prolific-homecare-logo.png"
              alt="Prolific Homecare"
              className="mx-auto h-12 w-auto mb-4" // Centered logo
            />
            <h2 className="text-2xl font-semibold text-foreground">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... existing form inputs ... */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Animation Column (Hidden on mobile, visible on md screens and up) */}
        <div className="hidden md:flex justify-center items-center">
          <Lottie 
            animationData={loginAnimationData} 
            loop={true} 
            style={{ width: 300, height: 300 }} // Adjust size as needed
          />
        </div>
      </div>
    </div>
  );
};

export default MinimalLogin;