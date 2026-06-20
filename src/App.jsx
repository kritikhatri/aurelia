import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import useThemeStore from './features/useThemeStore';
import useAuthStore from './features/useAuthStore';
import { SkeletonText } from './components/common/Skeleton';
import { Toaster } from 'sonner';

// Lazy loading page components
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const RoutinePage = lazy(() => import('./pages/RoutinePage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LayeringSimulator = lazy(() => import('./pages/LayeringSimulator'));

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/auth?tab=login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-20">
    <div className="w-8 h-8 rounded-full border-2 border-plum border-t-gold animate-spin" />
    <span className="font-serif italic text-xs tracking-widest text-plum/60 dark:text-ivory/60">Aurelia is loading...</span>
  </div>
);

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogArticle />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="routine" element={<RoutinePage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="layering-simulator" element={<LayeringSimulator />} />
            
            {/* Customer Protected */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="checkout/success" element={
              <ProtectedRoute>
                <CheckoutSuccess />
              </ProtectedRoute>
            } />
          </Route>

          {/* Guest Only */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Admin Protected */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
