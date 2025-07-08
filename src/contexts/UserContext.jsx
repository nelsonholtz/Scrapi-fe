import { createContext, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../services/firebase";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
