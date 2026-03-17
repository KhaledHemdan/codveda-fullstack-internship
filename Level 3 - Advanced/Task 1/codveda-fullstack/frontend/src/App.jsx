import { useState } from 'react';
import axios from 'axios';

function App() {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'user' });
  const [status, setStatus] = useState('');

  const handleAction = async (endpoint) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, credentials);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
      }
      setStatus(`${endpoint} successful!`);
    } catch (err) {
      // Using 'err' here to provide specific feedback
      setStatus(`Error: ${err.response?.data?.message || 'Action failed'}`);
    }
  };

  const testAdmin = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus(res.data.message);
    } catch (err) {
      // We log 'err' to the console to satisfy ESLint and help with debugging
      console.error("Admin Access Error:", err);
      setStatus("Access Denied: You are not an Admin");
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Codveda Full-Stack Auth</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={e => setCredentials({...credentials, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setCredentials({...credentials, password: e.target.value})} 
        />
        <select onChange={e => setCredentials({...credentials, role: e.target.value})}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleAction('register')}>Register</button>
          <button onClick={() => handleAction('login')}>Login</button>
        </div>
      </div>
      
      <hr style={{ margin: '20px 0' }} />
      
      <button onClick={testAdmin} style={{ padding: '10px', cursor: 'pointer' }}>
        Access Admin Panel
      </button>
      
      <p style={{ marginTop: '20px', padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}

export default App;