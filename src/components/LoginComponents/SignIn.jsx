import { useState, useContext } from "react";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "../LoginComponents/auth.css";
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

const SignIn = () => {
    const { user, setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setUser(user);
                navigate("/create");
            })
            .catch((err) => {
                setError(
                    "Please check your email address and password agian 👺"
                );
                setLoading(false);
                console.log(err.code, err.message);
            });
    };

    const handleResetPassword = () => {
        if (!email) {
            setError("Please enter your email first");
            return;
        }

        setLoading(true);
        setError(null);

        sendPasswordResetEmail(firebaseAuth, email)
            .then(() => {
                setResetEmailSent(true);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <form onSubmit={handleSignIn} className="auth">
                {error && (
                    <div className="error-message">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="close-btn"
                        >
                            ×
                        </button>
                    </div>
                )}
                {resetEmailSent && (
                    <div className="success-message">
                        Password reset email sent! Check your inbox.
                    </div>
                )}
                <h1 className="script-text">Sign In</h1>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            paddingRight: "36px", // Space for the eye icon
                            height: "40px",
                            fontSize: "16px",
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                        style={{
                            position: "absolute",
                            top: "20%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            backgroundColor: "white",
                            border: "none",
                            padding: "4px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "0px",
                            width: "24px",
                        }}
                    >
                        {showPassword ? (
                            <LuEye size={14} />
                        ) : (
                            <LuEyeClosed size={14} />
                        )}
                    </button>
                </div>

                <Link
                    to="/resetpassword"
                    className="reset-password-link"
                    onClick={handleResetPassword}
                >
                    Forgot Password?
                </Link>
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Sign In"}
                </button>
                <div className="link-container">
                    <Link to="/createprofile" className="create-profile-link">
                        Create Profile
                    </Link>
                </div>
            </form>
        </>
    );
};

export default SignIn;
