import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import SavedPlaces from './pages/SavedPlaces';
import History from './pages/History';
import Auth from './pages/Auth';
import ApiKeyTest from './pages/ApiKeyTest';
import ProtectedRoute from './ProtectedRoute';
import RootRedirect from './RootRedirect';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Smart entry point — no ProtectedRoute here */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><SavedPlaces /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/test" element={<ApiKeyTest />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}