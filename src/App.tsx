import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PedalDetail from './pages/PedalDetail';
import PedalBoard3DPage from './pages/PedalBoard3DPage';

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="3d" element={<PedalBoard3DPage />} />
            <Route path=":slug" element={<PedalDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App; 