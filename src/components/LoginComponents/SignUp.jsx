import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const [emailError, setEmailError] = useState("");
  const [avatarURLError, setAvatarURLError] = useState("");

  const navigate = useNavigate();

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleAvatarURLChange = (e) => {
    const value = e.target.value;
    setAvatarURL(value);

    if (value && !urlRegex.test(value)) {
      setAvatarURLError("Please enter a valid URL.");
    } else {
      setAvatarURLError("");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (emailError || avatarURLError) return;
    console.log({
      firstName,
      lastName,
      username,
      avatarURL,
      email,
      password,
    });

    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
          firstName,
          lastName,
          username,
          avatarURL,
          email,
          createdAt: new Date().toISOString(),
        };
        setDoc(doc(db, "users", user.uid), userData)
          .then(() => {
            navigate("/profile");
          })
          .catch((error) => {
            console.error("Error saving user data to Firestore:", error);
          });
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorCode, errorMessage);

        if (errorCode === "auth/invalid-email") {
          setEmailError("Invalid email address.");
        } else {
          setEmailError("");
        }
      });
  };
  const getInputClass = (error, value) => {
    if (error) return "error";
    if (value && !error) return "success";
    return "";
  };

  return (
    <>
      <form onSubmit={handleSignUp} className="auth">
        <h1 className="script-text">Create an account</h1>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          required
          minLength={2}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          required
          minLength={2}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          required
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="avatarURL">Avatar URL</label>
        <input
          id="avatarURL"
          type="url"
          value={avatarURL}
          onChange={(e) => setAvatarURL(e.target.value)}
        />
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          className={getInputClass(emailError, email)}
        />
        {emailError && <p style={{ color: "red" }}>{emailError}</p>}

        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};

export default SignUp;
