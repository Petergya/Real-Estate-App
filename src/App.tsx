import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminRegister from './pages/AdminRegister';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';
import PropertiesMap from './pages/PropertiesMap';
import PropertyTypePage from './pages/PropertyTypePage';
import AboutUs from './pages/AboutUs.tsx';
import Contact from './pages/Contact.tsx';
import Privacy from './pages/Privacy.tsx';
import Terms from './pages/Terms';
// import { Sheet } from 'lucide-react';
 import Schedule from './pages/schedule';
import MediaDemo from './pages/MediaDemo';
import Messages from './pages/Messages';
//  import CameraTest from './pages/cam';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col min-h-screen ${isAdminRoute ? 'bg-slate-900' : 'bg-white'}`}>
      {!isAdminRoute && <Navbar />}
              <main className={`flex-grow ${!isAdminRoute ? 'pt-16' : ''}`}>
                <Toaster position="bottom-right" />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/type/:type" element={<PropertyTypePage />} />
                  <Route path="/properties/map" element={<PropertiesMap />} />
                  <Route path="/property/:id" element={<PropertyDetails />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/register" element={<AdminRegister />} />
                  <Route path="/payment/:propertyId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/media-demo" element={<MediaDemo />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  {/* <Route path="/camera-test" element={<CameraTest />} /> */}
                </Routes>
            </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <PaymentProvider>
          <NotificationProvider>
            <Router>
              <AppContent />
            </Router>
          </NotificationProvider>
        </PaymentProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;