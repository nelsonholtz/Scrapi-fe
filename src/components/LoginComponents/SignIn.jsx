import { useState, useContext } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const SignIn = () => {

    const { user, setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


  const handleSignIn = (e) => {
    e.preventDefault();
    
        signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setUser(user);
                navigate("/create");
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode, errorMessage);
            });
    };

  return (
    <>
      <form onSubmit={handleSignIn} className="auth">
        <h1 className="script-text">Sign In</h1>
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </>
  );

};

export default SignIn;
