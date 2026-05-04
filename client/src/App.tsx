import { Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
// Import your detail page (create this if you haven't yet)
import ProductDetailsPage from './pages/ProductDetailsPage'; 

function App() {
  return (
    <div className="bg-depth-base min-h-screen">
      {/* 1. Routes acts as a container for all your pages */}
      <Routes>
        
        {/* 2. The 'path' is what shows in the URL, 'element' is the component to show */}
        <Route path="/products" element={<ProductsPage />} />
        
        {/* 3. The ':id' is a dynamic parameter for specific products */}
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        
      </Routes>
    </div>
  );
}

export default App;