import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import { useUser } from "../contexts/UserContext";
import { saveBoard, getUserBoard } from "../services/boardSaving";

//component imports
import Toolbar from "../components/Toolbar";
import DraggableImage from "../components/DraggableImage";
import EditableText from "../components/EditableText";
import LogOut from "../components/LoginComponents/LogOut";

import UndoRedo from "../components/Toolbar_components/UndoRedo";

import ToolbarPlaceholder from "../components/placeholderForCSS";
import "../components/toolBar.css";

const { handleUndo, handleRedo } = UndoRedo;

const CreateBoard = () => {
  const [elements, setElements] = useState([]);
    const [date, setDate] = useState("2025-07-08");
  
   const stageRef = useRef();
    const { user } = useUser();

  const history = useRef([{ x: 20, y: 20, scaleX: 1, scaleY: 1, rotation: 0 }]);
  const historyStep = useRef(0);
  const [position, setPosition] = useState(history.current[0]);


    useEffect(() => {
        if (user && date) {
            getUserBoard(user.uid, date).then((board) => {
                if (board) {
                    setElements(board.elements);
                } else {
                    setElements([]);
                }
            });
        }
    }, [user, date]);

  const handleAddElement = useCallback((elementType, elementData) => {
    const newElement = {
      id: uuidv4(),
      type: elementType,
      ...elementData,
      x: 200,
      y: 200,
    };

    setElements((prev) => [...prev, newElement]);
  }, []);

  const handleTextChange = (id, newText) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, text: newText } : element
      )

    const handleUpdateElement = (id, updates) => {
        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        );
    };

    const handleSaveBoard = async () => {
        if (!user) return console.log("You must be logged in to save!");

        try {
            await saveBoard({
                elements,
                user,
                date,
            });

            alert("Board saved!");
        } catch (err) {
            console.error("Error saving board", err);
            alert("Failed to save board");
        }
    };
    return (
        <div className="create-board-page">
            <LogOut />

            <button onClick={handleSaveBoard}>Save 💾</button>
            <label htmlFor="boardDate">Select Date:</label>
            <input
                type="date"
                id="boardDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <ToolbarPlaceholder />
            <Toolbar
                onAddText={() => handleAddElement("text", { text: "New Text" })}
                onAddImage={() => handleAddElement("image")}
                 onUndo={() => handleUndo({ history, historyStep, setPosition })}
        onRedo={() => handleRedo({ history, historyStep, setPosition })}
            />

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <Layer>
                    {elements.map((element) => {
                        if (element.type === "text") {
                            return (
                                <EditableText
                                    key={element.id}
                                    id={element.id}
                                    text={element.text}
                                    x={element.x}
                                    y={element.y}
                                    onChange={handleTextChange}
                                    onUpdate={handleUpdateElement}
                                    stageRef={stageRef}
                                />
                            );
                        }
                        if (element.type === "image") {
                            return (
                                <DraggableImage
                                    key={element.id}
                                    id={element.id}
                                   
                                    onUpdate={handleUpdateElement}
  position={position}
            setPosition={setPosition}
            history={history}
            historyStep={historyStep}
                                />
                            );
                        }
                        return null;
                    })}
                </Layer>
            </Stage>
        </div>
    );
  };

export default CreateBoard;
