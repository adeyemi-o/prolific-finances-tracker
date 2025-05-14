import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full px-4 py-3 text-xs text-center text-muted-foreground bg-background border-t border-border mt-auto">
      <span>
        &copy; {new Date().getFullYear()} Prolific Homecare. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer; 