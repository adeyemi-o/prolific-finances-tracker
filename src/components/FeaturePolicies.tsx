import React, { useEffect } from 'react';

/**
 * Component to handle and suppress feature detection errors
 * This component prevents unnecessary console errors for unsupported features
 */
const FeaturePolicies: React.FC = () => {
  useEffect(() => {
    // Define a list of features we know will cause errors
    const unsupportedFeatures = ['vr', 'ambient-light-sensor', 'battery'];
    
    // Override the feature detection to prevent errors
    const originalQuery = navigator.permissions?.query;
    if (originalQuery) {
      // @ts-ignore - We're intentionally overriding this method
      navigator.permissions.query = (permissionDesc: any) => {
        if (typeof permissionDesc === 'object' && 
            'name' in permissionDesc && 
            unsupportedFeatures.includes(permissionDesc.name)) {
          // Return a mock promise that resolves with a denied state
          return Promise.resolve({
            state: 'denied',
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          });
        }
        
        // Otherwise use the original implementation
        return originalQuery.call(navigator.permissions, permissionDesc);
      };
    }
    
    // Cleanup
    return () => {
      // Restore original function if needed
      if (originalQuery && navigator.permissions) {
        navigator.permissions.query = originalQuery;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FeaturePolicies;
