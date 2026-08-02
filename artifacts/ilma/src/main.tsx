import { createRoot } from 'react-dom/client';
import App from './App';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <>
    <LoadingScreen />
    <App />
  </>
);
