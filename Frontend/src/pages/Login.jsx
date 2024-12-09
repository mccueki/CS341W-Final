// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // to redirect after successful login
import './styles/Login.css'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // for error handling
  const [isNewUser, setIsNewUser] = useState(false); // toggle between login and registration
  const navigate = useNavigate(); // To redirect after successful login

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      let url = `${apiBaseUrl}/api/login`;
      let method = "POST";

      // If registering, switch to the registration endpoint
      if (isNewUser) {
        url = `${apiBaseUrl}/api/register`;
        method = "POST";
      }

      // Send the request to either login or register the user
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If login/register is successful, navigate to the balance page
        navigate("/");
      } else {
        const result = await response.json();
        setError(result.message || (isNewUser ? "Registration failed" : "Login failed"));
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>{isNewUser ? "Create an Account" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>} {/* Show error message if any */}
        <button type="submit">{isNewUser ? "Register" : "Login"}</button>
      </form>
      <p>
        {isNewUser
          ? "Already have an account? "
          : "Don't have an account? "}
        <button onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser ? "Login" : "Create Account"}
        </button>
      </p>
    </div>
  );
}

export default Login;
