import { useState } from "react";
import "./App.css";
import CreateBoard from "./pages/CreateBoard";
import Calendar from "react-calendar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Calendar />
      <CreateBoard />
    </>
  );
}

export default App;
