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
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminCars from './pages/AdminCars';
import AdminStatistics from './pages/AdminStatistics';
import AdminUsers from './pages/AdminUsers';
import AdminContact from './pages/AdminContact';

// Floating WhatsApp Button
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212600000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center justify-center"
      style={{ boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)' }}
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// Floating Scroll to Top Button
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 bg-[#F01023] hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110 flex items-center justify-center"
      style={{ boxShadow: '0 4px 12px rgba(240, 16, 35, 0.4)' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  ) : null;
}

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
        
        {/* Floating Buttons - Only show on non-admin routes */}
        {!isAdminRoute && (
          <>
            <ScrollToTopButton />
            <WhatsAppButton />
          </>
        )}
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