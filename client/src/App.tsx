import { Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
// Import your detail page (create this if you haven't yet)
import ProductDetailsPage from './pages/ProductDetailsPage'; 
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="bg-depth-base min-h-screen">
      <Routes>
        
        <Route path="/products" element={<ProductsPage />} />
        
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route path="/admin" element={<AdminPage />} />
        
      </Routes>
    </div>
  );
}

export default App;