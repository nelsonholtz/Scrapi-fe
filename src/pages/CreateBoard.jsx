import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../contexts/UserContext";
import { saveBoard, getUserBoard } from "../services/boardSaving";

import Toolbar from "../components/Toolbar";
import DraggableImage from "../components/DraggableImage";
import EditableText from "../components/EditableText";
//import LogOut from "../components/LoginComponents/LogOut";
import ToolbarPlaceholder from "../components/placeholderForCSS";
import DatePicker from "../components/DatePicker";
import FloatingToolbar from "../components/FloatingToolbar";

import StickerLibrary from "../components/StickerLibrary";
import "../components/toolBar.css";
import "../styles/errorMessage.css";

const CreateBoard = () => {
    const [elements, setElements] = useState([]);
    const [date, setDate] = useState("2025-07-11");
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFont, setSelectedFont] = useState("Arial");

    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [showStickerLibrary, setShowStickerLibrary] = useState(false);

    const stageRef = useRef();
    const { user } = useUser();

    const selectedElement = elements.find((el) => el.id === selectedId);
    const isTextSelected = selectedElement?.type === "text";

    useEffect(() => {
        if (user && date) {
            getUserBoard(user.uid, date)
                .then((board) => {
                    if (board) {
                        setElements(board.elements || []);
                        setIsPublic(!!board.public);
                    } else {
                        setElements([]);
                        setIsPublic(false);
                    }
                })
                .catch((err) => {
                    setError(err);
                    console.error("Failed to load board", err);
                });
        }
    }, [user, date]);

    const pushToHistory = useCallback((newElements) => {
        setHistory((prev) => [...prev, newElements]);
        setRedoStack([]); // Clear redo stack on new action
    }, []);

    const handleAddElement = useCallback(
        (elementType, elementData) => {
            const newElement = {
                id: uuidv4(),
                type: elementType,
                ...elementData,
                x: 200,
                y: 200,
                text: elementData?.text || "text",
                fontSize: 20,
            };
            setElements((prev) => {
                const newElements = [...prev, newElement];
                pushToHistory(newElements); // push the updated array, not old 'elements'
                return newElements;
            });
        },
        [pushToHistory]
    );

    const handleAddImageElement = useCallback(
        (imageUrl) => {
            try {
                const newImageElement = {
                    id: uuidv4(),
                    type: "image",
                    src: imageUrl,
                    x: 200,
                    y: 200,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                };
                setElements((prev) => {
                    const newElements = [...prev, newImageElement];
                    pushToHistory(newElements);
                    return newElements;
                });
                // setError(null);
            } catch (err) {
                setError("This image is hiding, please try again");
                console.error("This image has been lost in the scrapbook", err);
            }
        },
        [pushToHistory]
    );

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
            pushToHistory(newElements);
            return newElements;
        });
    };

    const handleDelete = () => {
        if (!selectedId) return;
        setElements((prev) => {
            const newElements = prev.filter((el) => el.id !== selectedId);
            pushToHistory(newElements);
            return newElements;
        });
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

    const moveLayer = (direction) => {
        setElements((prev) => {
            const index = prev.findIndex(
                (element) => element.id === selectedId
            );
            if (index < 0) return prev;

            const newIndex = direction === "up" ? index + 1 : index - 1;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newElements = [...prev];
            const [movedElement] = newElements.splice(index, 1);
            newElements.splice(newIndex, 0, movedElement);

            pushToHistory(newElements);
            return newElements;
        });
    };

    const handleSaveBoard = async () => {
        if (!user) {
            return console.log("You must be logged in to save!");
        }
        if (elements.length === 0) {
            setError(
                "Why dont you add something to your wonderful board before saving 😏"
            );
        }
        try {
            await saveBoard({
                elements,
                user,
                date,
                public: isPublic,
            });
            //   setError(null);
            //   alert("Board saved!");
        } catch (err) {
            //   alert("Failed to save board");
            console.error("Error saving board", err);
        }
    };

    return (
        <div className="create-board-page">
            {error && (
                <div className="error-message">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="close-btn"
                    >
                        ×
                    </button>
                </div>
            )}

            <button onClick={handleSaveBoard}>Save 💾</button>
            <label>
                Make public?
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />
            </label>
            <DatePicker date={date} onDateChange={setDate} />

            <Toolbar
                onAddText={() => handleAddElement("text", { text: "New Text" })}
                onAddImage={() => handleAddElement("image")}
                onUploadingComplete={handleAddImageElement}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onUploadError={(msg) => setError(msg)}
                onDelete={handleDelete}
                selectedId={selectedId}
                onOpenStickerLibrary={() => setShowStickerLibrary(true)}
            />
            <StickerLibrary
                isOpen={showStickerLibrary}
                onClose={() => setShowStickerLibrary(false)}
                onSelectSticker={(src) => handleAddElement("image", { src })}
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
                                    fontFamily={element.fontFamily}
                                    fontSize={element.fontSize || 20}
                                    rotation={element.rotation}
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
                                    src={element.src}
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
            {selectedId && (
                <FloatingToolbar
                    onMoveUp={() => moveLayer("up")}
                    onMoveDown={() => moveLayer("down")}
                    onDelete={handleDelete}
                    isTextSelected={isTextSelected}
                    selectedFont={
                        isTextSelected
                            ? selectedElement?.fontFamily || "Arial"
                            : undefined
                    }
                    onFontChange={(newFont) => {
                        if (isTextSelected && selectedId) {
                            handleUpdateElement(selectedId, {
                                fontFamily: newFont,
                            });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CreateBoard;
