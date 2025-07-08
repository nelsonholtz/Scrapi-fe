import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <UserProvider>
        <App />
    </UserProvider>
);
