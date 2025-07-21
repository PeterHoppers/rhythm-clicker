import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <span id='Logger'></span>
    <App />
  </>,
)