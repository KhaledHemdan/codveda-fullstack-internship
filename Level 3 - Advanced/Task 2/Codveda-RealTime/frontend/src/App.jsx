import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Establish connection to the backend
const socket = io.connect("http://localhost:5000");

function App() {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    // 1. Listen for Live Notifications
    socket.on("notification", (data) => {
      setNotif(data);
      // Auto-hide notification after 4 seconds
      setTimeout(() => setNotif(null), 4000);
    });

    // 2. Listen for Chat Messages
    socket.on("receive_msg", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("notification");
      socket.off("receive_msg");
    };
  }, []);

  const handleLogin = () => {
    if (user !== "") {
      socket.emit("join_server", user);
      setIsLoggedIn(true);
    }
  };

  const sendChat = () => {
    if (msg !== "") {
      const chatData = { author: user, message: msg, time: new Date().toLocaleTimeString() };
      socket.emit("send_msg", chatData);
      setMsg(""); // Clear input
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Task 2: WebSockets</h1>

      {/* Real-time Notification Pop-up */}
      {notif && (
        <div style={{ background: '#4caf50', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>{notif.title}:</strong> {notif.message}
        </div>
      )}

      {!isLoggedIn ? (
        <div>
          <input placeholder="Enter Username..." onChange={(e) => setUser(e.target.value)} />
          <button onClick={handleLogin}>Join System</button>
        </div>
      ) : (
        <div>
          <h3>Welcome, {user}</h3>
          <div style={{ border: '1px solid #ddd', height: '300px', overflowY: 'auto', padding: '10px', marginBottom: '10px', background: '#f9f9f9' }}>
            {chat.map((c, i) => (
              <div key={i} style={{ marginBottom: '10px', textAlign: c.author === user ? 'right' : 'left' }}>
                <div style={{ background: c.author === user ? '#007bff' : '#eee', color: c.author === user ? 'white' : 'black', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>
                  <strong>{c.author}:</strong> {c.message}
                </div>
              </div>
            ))}
          </div>
          <input value={msg} placeholder="Message..." onChange={(e) => setMsg(e.target.value)} />
          <button onClick={sendChat}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;