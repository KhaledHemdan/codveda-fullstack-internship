const API_URL = 'http://localhost:3000/api/products';

// Function to fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        const list = document.getElementById('productList');
        
        list.innerHTML = ''; // Clear current list
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${product.name} - $${product.price}</span>
                <button onclick="deleteProduct(${product.id})" style="background:red">Delete</button>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to add a product
async function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    });

    fetchProducts(); // Refresh the list
}

// Function to delete a product
async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchProducts(); // Refresh the list
}

// Initial fetch when page loads
fetchProducts();