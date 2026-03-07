import { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [adminInfo, setAdminInfo] = useState('');

  const handleSignup = async () => {
    await axios.post('http://localhost:3000/api/signup', { username, password });
    setMessage("Signed up! Now please login.");
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/login', { username, password });
      localStorage.setItem('token', res.data.token); // Store token securely
      setMessage("Logged in successfully!");
    } catch (err) {
      setMessage("Login failed!");
    }
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin-data', {
        headers: { authorization: token } // Send token in headers
      });
      setAdminInfo(res.data.secretData);
    } catch (err) {
      setAdminInfo("Access Denied: Admin only.");
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Codveda Auth System</h1>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <hr />
      <button onClick={fetchAdminData}>View Admin Secret Data</button>
      <h3>{adminInfo}</h3>
    </div>
  );
}

export default App;