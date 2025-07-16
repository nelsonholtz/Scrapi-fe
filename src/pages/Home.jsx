import React, { useState, useEffect } from "react";
import SignUp from "../components/LoginComponents/SignUp";
import SignIn from "../components/LoginComponents/SignIn";
import LogOut from "../components/LoginComponents/LogOut";
import "../styles/loading.css";
import "../styles/errorMessage.css";
import Loading from "../components/Loading";
import Welcome from "../components/Welcome";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading state={"loading"} />;
    }

    if (error)
        return (
            <div className="error-container">
                <button className="close-btn" onClick={() => setError(null)}>
                    ×
                </button>
                <div className="error-whale">🐳</div>
                <p className="error-text">{error}</p>
            </div>
        );

    return (
        <>
            <Welcome />
            <SignIn />
        </>
    );
};

export default Home;
