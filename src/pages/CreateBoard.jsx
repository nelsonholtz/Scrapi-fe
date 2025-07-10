import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../contexts/UserContext";
import { saveBoard, getUserBoard } from "../services/boardSaving";

import Toolbar from "../components/Toolbar";
import DraggableImage from "../components/DraggableImage";
import EditableText from "../components/EditableText";
import LogOut from "../components/LoginComponents/LogOut";
import ToolbarPlaceholder from "../components/placeholderForCSS";
import "../components/toolBar.css";

const CreateBoard = () => {
    const [elements, setElements] = useState([]);
    const [date, setDate] = useState("2025-07-08");
    const [selectedId, setSelectedId] = useState(null);

    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    const stageRef = useRef();
    const { user } = useUser();

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

    const pushToHistory = useCallback((newElements) => {
        setHistory((prev) => [...prev, newElements]);
        setRedoStack([]); // Clear redo stack on new action
    }, []);

        

    const handleAddElement = useCallback((elementType, elementData) => {
        const newElement = {
            id: uuidv4(),
            type: elementType,
            ...elementData,
            x: 200,
            y: 200,
            text: elementData?.text || "text",
        };
        const newElements = [...elements, newElement];
        pushToHistory(elements);
        setElements(newElements);
    }, [elements, pushToHistory]);

    const handleTextChange = (id, newText) => {
        setElements((prev) => {
          const newElements = prev.map((el) =>
            el.id === id ? { ...el, text: newText } : el
          );
      
          //Deep clone before saving to history so it captures the actual text
          const cloned = JSON.parse(JSON.stringify(newElements));
          setRedoStack([]); // Clear redo on typing
          setHistory((prevHistory) => [...prevHistory, cloned]);
      
          return newElements;
        });
      };

    const handleUpdateElement = (id, updates) => {
        setElements((prev) => {
            const newElements = prev.map((el) =>
                el.id === id ? { ...el, ...updates } : el
            );
            pushToHistory(prev);
            return newElements;
        });
    };

    const handleDelete = () => {
        if (!selectedId) return;
        const newElements = elements.filter(el => el.id !== selectedId);
        pushToHistory(elements);
        setElements(newElements);
        setSelectedId(null);
    };

            
    const handleUndo = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        setRedoStack((prev) => [...prev, elements]);
        setHistory((prev) => prev.slice(0, -1));
        setElements(previous);
        setSelectedId(null);
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setRedoStack((prev) => prev.slice(0, -1));
        setHistory((prev) => [...prev, elements]);
        setElements(next);
        setSelectedId(null);
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
                onUndo={handleUndo}
                onRedo={handleRedo}
                onDelete={handleDelete}
                selectedId={selectedId}
            />

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={(e) => {
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) setSelectedId(null);
                }}
            >
                <Layer>
                    {elements.map((element) => {
                        const isSelected = element.id === selectedId;
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
                                    isSelected={isSelected}
                                    onSelect={() => setSelectedId(element.id)}
                                    stageRef={stageRef}
                                />
                            );
                        }
                        if (element.type === "image") {
                            return (
                                <DraggableImage
                                    key={element.id}
                                    id={element.id}
                                    x={element.x}
                                    y={element.y}
                                    scaleX={element.scaleX}
                                    scaleY={element.scaleY}
                                    rotation={element.rotation}
                                    isSelected={isSelected}
                                    onSelect={() => setSelectedId(element.id)}
                                    onUpdate={handleUpdateElement}
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
