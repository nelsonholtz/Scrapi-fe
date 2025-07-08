import { useState, useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./auth.css";
const LogOut = () => {
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate;

  if (!user) return null;

  const handleLogOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        setUser(null);
        console.log("user logged out");
        setMessage("You have logged out successfully");
        navigate("./");
      })
      .catch((err) => {
        setMessage("Error logging you out");
        console.log(err.message);
        console.log("log out error");
      });
  };

  return (
    <button onClick={handleLogOut} className="logout-button">
      Log Out
    </button>
  );
};

export default LogOut;
