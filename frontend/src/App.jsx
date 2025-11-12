import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PropertyList from './pages/property/PropertyList'
import PropertyDetail from './pages/property/PropertyDetail'
import CreateProperty from './pages/property/CreateProperty'
import MyProperties from './pages/property/MyProperties'
import BranchAdminDashboard from './pages/admin/BranchAdminDashboard'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import ServiceBooking from './pages/services/ServiceBooking'
import MyBookings from './pages/services/MyBookings'
import Chat from './pages/chat/Chat'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  // Protected Route Component
  const ProtectedRoute = ({ children, roles = [] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
      return <Navigate to="/" replace />
    }

    return children
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="properties" element={<PropertyList />} />
        <Route path="properties/:id" element={<PropertyDetail />} />

        {/* Protected Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-properties"
          element={
            <ProtectedRoute roles={['seller', 'branch_admin', 'super_admin']}>
              <MyProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-property"
          element={
            <ProtectedRoute roles={['seller', 'branch_admin', 'super_admin']}>
              <CreateProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/:type"
          element={
            <ProtectedRoute>
              <ServiceBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Branch Admin Routes */}
        <Route
          path="branch-admin/*"
          element={
            <ProtectedRoute roles={['branch_admin']}>
              <BranchAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="super-admin/*"
          element={
            <ProtectedRoute roles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
