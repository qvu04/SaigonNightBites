import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import SavedPlaces from './pages/SavedPlaces';
import History from './pages/History';
import Auth from './pages/Auth';
import ProtectedRoute from './ProtectedRoute';
import RootRedirect from './RootRedirect';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><SavedPlaces /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}