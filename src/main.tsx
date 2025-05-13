
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import FeaturePolicies from './components/FeaturePolicies.tsx'
import React from 'react'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FeaturePolicies />
    <App />
  </React.StrictMode>
);
