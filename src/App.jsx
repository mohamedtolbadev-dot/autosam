import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './i18n'; // Initialize i18next
import { CurrencyProvider } from './context/CurrencyContext';
import { CustomerProvider } from './context/CustomerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminCars from './pages/AdminCars';
import AdminStatistics from './pages/AdminStatistics';
import AdminUsers from './pages/AdminUsers';
import AdminContact from './pages/AdminContact';

// 2. Création du composant qui gère le scroll
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // S'active à chaque changement de route

  return null;
}

// Composant qui gère l'affichage conditionnel du Header/Footer
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {!isAdminRoute && <Header />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<CustomerRegister />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/cars" element={<AdminCars />} />
            <Route path="/admin/statistics" element={<AdminStatistics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* 3. Intégration du composant ici, DANS le Router */}
      <ScrollToTop /> 
      
      <CurrencyProvider>
        <CustomerProvider>
          <Layout />
        </CustomerProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}

export default App;