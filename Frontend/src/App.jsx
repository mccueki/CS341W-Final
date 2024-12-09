import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import './App.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Fetch the current active user's data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/current-user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for using token, if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);  // Set the username in state
        } else {
          console.error('Failed to fetch active user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    }

    fetchUserData();
  }, []);  
  return (
    <>
      <div className="container">
        <nav>
          <ul>
            <li className="home-link"><Link to="/">Home</Link></li>  {/* Link to Home page */}
            <p>|</p>
            <li className="login-link"><Link to="/login">Login</Link></li>  {/* Link to Login page */}
          </ul>
        </nav>
        <div className="content">
          <Outlet />
        </div>
      </div>
      <div className="name">
        {loading ? (
          <h2>Loading...</h2>  // Show loading message while fetching data
        ) : username ? (
          <h2>Welcome, {username}!</h2>  // Display username after successful login
        ) : (
          <h2>Welcome, Guest!</h2>  // Display a default message if no user is logged in
        )}
      </div>
    </>
  );
}

export default App;



