// App.js
import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import CreateBoard from "./pages/CreateBoard";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import CreateProfile from "./pages/CreateProfile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  const handleBackgroundColorChange = (rgb) => {
    setBackgroundColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
  };

  return (
    <Router>
      <Navbar backgroundColor={backgroundColor} />
      <div style={{ backgroundColor, minHeight: "100vh" }}>
        <Routes>
          <Route
            path="/"
            element={
              <Home onBackgroundColorChange={handleBackgroundColorChange} />
            }
          />
          <Route path="/createprofile" element={<CreateProfile />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/create"
            element={
              <CreateBoard
                onBackgroundColorChange={handleBackgroundColorChange}
              />
            }
          />
          <Route
            path="/board/:datePath"
            element={
              <CreateBoard
                onBackgroundColorChange={handleBackgroundColorChange}
              />
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
