import React, { useState, useEffect } from "react";
import SignUp from "../components/LoginComponents/SignUp";
import SignIn from "../components/LoginComponents/SignIn";
import LogOut from "../components/LoginComponents/LogOut";
import "../styles/loading.css";
import "../styles/errorMessage.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="whale">🐋</div>
        <div>loading page</div>
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="error-container">
        <button className="close-btn" onClick={() => setError(null)}>
          ×
        </button>
        <div className="error-whale">🐳</div>
        <p className="error-text">Our moodboards aren't flowing right now</p>
      </div>
    );

  return (
    <>
      <SignIn />
      <LogOut />
      <SignUp />
    </>
  );
};

export default Home;
