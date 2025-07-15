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

const SignIn = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("An error has happened during your sign in 👺");
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
            <button onClick={() => setError(null)} className="close-btn">
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </button>

        <div className="link-container">
          <Link to="/createprofile" className="create-profile-link">
            Create Profile
          </Link>

          <Link
            to="/resetpassword"
            className="reset-password-link"
            onClick={handleResetPassword}
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </>
  );
};

export default SignIn;
