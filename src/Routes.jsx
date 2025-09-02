import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SearchResults from './pages/search-results';
import PropertyListingsBrowse from './pages/property-listings-browse';
import PropertyDetailView from './pages/property-detail-view';
import UserProfileSettings from './pages/user-profile-settings';
import InquiryManagementDashboard from './pages/inquiry-management-dashboard';
import AdminDashboard from './pages/admin-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<InquiryManagementDashboard />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/property-listings-browse" element={<PropertyListingsBrowse />} />
        <Route path="/property-detail-view" element={<PropertyDetailView />} />
        <Route path="/user-profile-settings" element={<UserProfileSettings />} />
        <Route path="/inquiry-management-dashboard" element={<InquiryManagementDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;