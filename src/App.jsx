import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import CreateBoard from "./pages/CreateBoard";
import Calendar from "react-calendar";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import CreateProfile from "./pages/CreateProfile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/create" element={<CreateBoard />} />
        <Route path="/board/:datePath" element={<CreateBoard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </Router>
  );
}

export default App;
