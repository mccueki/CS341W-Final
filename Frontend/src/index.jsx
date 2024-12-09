// src/index.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home";  // Assuming you have this component now
import AddBalance from "./pages/AddBalance";
import Login from "./pages/Login";  // Import Login component

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <Router>
    <Routes>
      {/* This will wrap all of your routes */}
      <Route path="/" element={<App />}>
        
        {/* Home page route */}
        <Route index element={<Home />} />
        <Route path="balance" element={<AddBalance />} />
        <Route path="/add-balance" element={<AddBalance />} />
        <Route path="/bank-balance" element={<AddBalance />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  </Router>
);
