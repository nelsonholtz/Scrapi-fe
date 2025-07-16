import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import CreateBoard from "./pages/CreateBoard";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import CreateProfile from "./pages/CreateProfile";
import ResetPassword from "./pages/ResetPassword";
import PublicProfilePage from "./pages/PublicProfilePage";
import { useUser } from "./contexts/UserContext";

function App() {
    const { user } = useUser();

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? <Navigate to="/explore" replace /> : <Home />
                    }
                />
                <Route path="/createprofile" element={<CreateProfile />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route
                    path="/create"
                    element={
                        user ? <CreateBoard /> : <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/board/:datePath"
                    element={
                        user ? <CreateBoard /> : <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/profile"
                    element={
                        user ? <ProfilePage /> : <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/explore"
                    element={
                        user ? <ExplorePage /> : <Navigate to="/" replace />
                    }
                />{" "}
                <Route
                    path="/profiles/:username"
                    element={<PublicProfilePage />}
                />
            </Routes>
        </Router>
    );
}

export default App;
