import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateBoard from "./pages/CreateBoard";
import Calendar from "react-calendar";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateBoard />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
