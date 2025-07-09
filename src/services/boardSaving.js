import {
    getDocs,
    query,
    collection,
    where,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const saveBoard = async ({ elements, user, date }) => {
    if (!user) throw new Error("User not logged in");

    const docId = `${user.uid}_${date}`;
    const boardRef = doc(db, "boards", docId);

    const boardData = {
        elements,
        userId: user.uid,
        date,
        updatedAt: serverTimestamp(),
    };

    await setDoc(boardRef, boardData);
    return boardRef.id;
};

export const getUserBoard = async (userId, date) => {
    if (!date) throw new Error("Date is required");

    const docId = `${userId}_${date}`;
    const boardRef = doc(db, "boards", docId);
    const docSnap = await getDoc(boardRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
};

export const getUserBoardDates = async (userId) => {
    if (!userId) throw new Error("No user id");

    const q = query(collection(db, "boards"), where("userId", "==", userId));
    const allBoards = await getDocs(q);

    const dates = [];
    allBoards.forEach((doc) => {
        const data = doc.data();
        if (data.date) {
            dates.push(data.date);
        }
    });
    return dates;
};
