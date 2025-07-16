import React, { useState, useEffect } from "react";
import SignUp from "../components/LoginComponents/SignUp";
import "../styles/loading.css";
import "../styles/errorMessage.css";
import Loading from "../components/Loading";

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
            <SignUp />
        </>
    );
};

export default Home;
