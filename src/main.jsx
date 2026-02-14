import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarProvider } from './context/CarContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarProvider>
      <BookingProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </BookingProvider>
    </CarProvider>
  </StrictMode>,
)
