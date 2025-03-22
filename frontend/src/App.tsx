import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { MarketTrends } from './pages/MarketTrends';
import { Settings } from './pages/Settings';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/portfolio" element={
          <Layout>
            <Portfolio />
          </Layout>
        } />
        <Route path="/market" element={
          <Layout>
            <MarketTrends />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;