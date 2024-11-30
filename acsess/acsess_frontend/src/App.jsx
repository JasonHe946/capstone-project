import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ContactAdmin from './components/ContactAdmin';
import Booking from './components/Booking';
import BookingPage from './components/BookingPage';
import HotDesk from './components/HotDesk';
import AnalyticsPage from './components/AnalyticsPage';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path='/contact-admin' element={<ContactAdmin />} />
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/booking/meeting-room" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/booking/hot-desk" element={<ProtectedRoute><HotDesk /></ProtectedRoute>} />
        </Routes>
      </Router>
  );
}

export default App;
