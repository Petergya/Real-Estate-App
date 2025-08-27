import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { PaymentProvider } from './contexts/PaymentContext';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';
import PropertiesMap from './pages/PropertiesMap';
// import { Sheet } from 'lucide-react';
 import Schedule from './pages/schedule';
import MediaDemo from './pages/MediaDemo';
//  import CameraTest from './pages/cam';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <PaymentProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Toaster position="bottom-right" />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/map" element={<PropertiesMap />} />
                  <Route path="/property/:id" element={<PropertyDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/payment/:propertyId" element={<Payment />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/media-demo" element={<MediaDemo />} />
                  {/* <Route path="/camera-test" element={<CameraTest />} /> */}
                </Routes>
              </main>
            </div>
          </Router>
        </PaymentProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;