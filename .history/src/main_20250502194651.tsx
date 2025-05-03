import { createRoot } from 'react-dom/client'
import './index.css'
import TestComponent from './components/TestComponent'

// Temporary test rendering to debug blank screen
createRoot(document.getElementById("root")!).render(<TestComponent />);
