import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TenantResolver, TenantSelector } from '@/tenancy/TenantResolver'
import { MainLayout } from '@/components/layout/MainLayout'
import { ToastProvider } from '@/components/Toast'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PageLoader } from '@/components/ui/skeleton'
import { logEnvInfo } from '@/config/env'
import { AuthProvider } from '@/auth/AuthContext'
import ProtectedRoute from '@/auth/ProtectedRoute'

// Import i18n configuration
import '@/i18n'

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'))
const WidgetGallery = lazy(() => import('@/pages/WidgetGallery'))
const AdminPanel = lazy(() => import('@/pages/AdminPanel'))
const Suggestions = lazy(() => import('@/pages/Suggestions'))
const Improvements = lazy(() => import('@/pages/Improvements'))
const ImprovementsV2 = lazy(() => import('@/pages/ImprovementsV2'))
const Roadmap = lazy(() => import('@/pages/Roadmap'))
const Phase6Test = lazy(() => import('@/pages/Phase6Test'))
const InteractiveDemo = lazy(() => import('@/pages/InteractiveDemo'))
const Login = lazy(() => import('@/pages/Login'))

// Log environment info on startup
logEnvInfo()

/**
 * Main Application Component
 * Sets up routing, error boundaries, and providers
 */
function App() {
  return (
    <ErrorBoundary title="Application Error" message="Something went wrong. Please refresh the page.">
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <Suspense fallback={<PageLoader />}>
                  <Login />
                </Suspense>
              } />
              <Route path="/select-tenant" element={<TenantSelector />} />

              {/* Protected Tenant Routes */}
              <Route
                path="/t/:tenantId"
                element={
                  <ProtectedRoute>
                    <TenantResolver>
                      <MainLayout />
                    </TenantResolver>
                  </ProtectedRoute>
                }
              >
                <Route index element={
                  <Suspense fallback={<PageLoader message="Loading Dashboard..." />}>
                    <Home />
                  </Suspense>
                } />
                <Route path="widgets" element={
                  <Suspense fallback={<PageLoader message="Loading Widgets..." />}>
                    <WidgetGallery />
                  </Suspense>
                } />
                <Route path="admin" element={
                  <Suspense fallback={<PageLoader message="Loading Admin Panel..." />}>
                    <AdminPanel />
                  </Suspense>
                } />
                <Route path="suggestions" element={
                  <Suspense fallback={<PageLoader message="Loading Suggestions..." />}>
                    <Suggestions />
                  </Suspense>
                } />
                <Route path="improvements" element={
                  <Suspense fallback={<PageLoader message="Loading Improvements..." />}>
                    <Improvements />
                  </Suspense>
                } />
                <Route path="improvements-v2" element={
                  <Suspense fallback={<PageLoader message="Loading..." />}>
                    <ImprovementsV2 />
                  </Suspense>
                } />
                <Route path="roadmap" element={
                  <Suspense fallback={<PageLoader message="Loading Roadmap..." />}>
                    <Roadmap />
                  </Suspense>
                } />
                <Route path="phase6-test" element={
                  <Suspense fallback={<PageLoader message="Loading Test..." />}>
                    <Phase6Test />
                  </Suspense>
                } />
                <Route path="demo" element={
                  <Suspense fallback={<PageLoader message="Loading Demo..." />}>
                    <InteractiveDemo />
                  </Suspense>
                } />
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/select-tenant" replace />} />
              <Route path="*" element={<Navigate to="/select-tenant" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
