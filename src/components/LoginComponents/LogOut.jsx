import { useState, useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./auth.css";
const LogOut = () => {
  const { user, setUser } = useUser();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        setUser(null);
        console.log("user logged out");
        setMessage("You have logged out successfully");
        navigate("/");
      })
      .catch((err) => {
        setMessage("Error logging you out");
        console.log(err.message);
        console.log("log out error");
      });
  };

  return (
    <a href="#" onClick={handleLogOut} className="logout-link">
      Log Out
    </a>
  );
};

export default LogOut;
