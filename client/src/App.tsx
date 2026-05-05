import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust path based on your folder structure
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage'; 
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-depth-base min-h-screen">
      {/* Persistant Navbar */}
      <div className='absolute top-0 left-0 w-full'><Navbar /></div>
      
      <main className="">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

