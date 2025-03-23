import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { MarketTrends } from './pages/MarketTrends';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { BrokerageCalculator } from './pages/BrokerageCalculator';
import { ThemeProvider } from './contexts/ThemeContext';
import SEBIrules from './pages/SEBIrules';
import { TradingView } from './pages/Graph';
import { ChatBot } from './pages/Chatbot';
import PaymentPage from './pages/PaymentPage';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

// App Routes component
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Layout>
              <Portfolio />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/market" 
        element={
          <ProtectedRoute>
            <Layout>
              <MarketTrends />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/calculator"
        element={
          <ProtectedRoute>
            <Layout>
              <BrokerageCalculator />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/graph"
        element={
          <ProtectedRoute>
            <Layout>
              <TradingView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/sebi-rules" 
        element={
          <ProtectedRoute>
            <Layout>
              <SEBIrules />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatBot />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/payment"
        element={
          <ProtectedRoute>
            <Layout>
              <PaymentPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-primary text-white">
            <AppRoutes />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
