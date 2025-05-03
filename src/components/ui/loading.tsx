
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({
  size = "md",
  className = "",
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center space-y-3",
    fullScreen ? "h-screen w-screen fixed inset-0 bg-background" : "py-8",
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
};

export default Loading;
