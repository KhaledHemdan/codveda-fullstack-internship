import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const API_URL = 'http://localhost:3000/api/products';

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) { console.error(err); }
    finally { setTimeout(() => setLoading(false), 800); } // Small delay to show loading state
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, { name, price: Number(price) });
    setName(''); setPrice('');
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Codveda Inventory (React)</h1>
      <form onSubmit={addProduct} style={{ marginBottom: '20px' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>

      {loading ? (
        <h2>Loading Data from API...</h2>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onDelete={deleteProduct} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;