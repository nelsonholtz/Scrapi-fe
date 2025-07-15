import { useState, useContext } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const SignIn = () => {
    const { user, setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [Loading, setLoading] = useState(false);
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
                const errorCode = err.code;
                const errorMessage =
                    "An error has happend during your sign in 👺";
                console.log(errorCode, errorMessage);
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
                <h1 className="script-text">Sign In</h1>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign In</button>
            </form>
        </>
    );
};

export default SignIn;
