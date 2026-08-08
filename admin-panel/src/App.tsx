import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SliderPage from './pages/SliderPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EventsPage from './pages/EventsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import CampusContentsPage from './pages/CampusContentsPage';
import FacultiesPage from './pages/FacultiesPage';
import ContactInfoPage from './pages/ContactInfoPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/slider" element={<SliderPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/opportunities" element={<OpportunitiesPage />} />
                <Route path="/campus-contents" element={<CampusContentsPage />} />
                <Route path="/faculties" element={<FacultiesPage />} />
                <Route path="/contact-info" element={<ContactInfoPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
