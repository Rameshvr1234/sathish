import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import './styles/global.css';

import store from './redux/store';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Public Pages
import HomePage from './pages/buyer/HomePage';
import SearchResults from './pages/buyer/SearchResults';
import PropertyDetail from './pages/buyer/PropertyDetail';
import ServicesPage from './pages/buyer/ServicesPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import PostProperty from './pages/seller/PostProperty';
import MyProperties from './pages/seller/MyProperties';

// Admin Pages
import BranchAdminDashboard from './pages/admin/BranchAdminDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#667eea',
            borderRadius: 8,
          },
        }}
      >
        <Router>
          <div className="App">
            <Header />
            
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<SearchResults />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Seller Routes (Protected) */}
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute roles={['seller', 'agent', 'builder']}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/post-property"
                  element={
                    <ProtectedRoute roles={['seller', 'agent', 'builder']}>
                      <PostProperty />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/my-properties"
                  element={
                    <ProtectedRoute roles={['seller', 'agent', 'builder']}>
                      <MyProperties />
                    </ProtectedRoute>
                  }
                />

                {/* Branch Admin Routes (Protected) */}
                <Route
                  path="/branch-admin/*"
                  element={
                    <ProtectedRoute roles={['branch_admin']}>
                      <BranchAdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Super Admin Routes (Protected) */}
                <Route
                  path="/super-admin/*"
                  element={
                    <ProtectedRoute roles={['super_admin']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Page */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
            </main>

            <Footer />
            
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
