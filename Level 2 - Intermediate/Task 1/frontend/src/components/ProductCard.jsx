export default function ProductCard({ product, onDelete }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '10px' }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onClick={() => onDelete(product.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
        Delete
      </button>
    </div>
  );
}