import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../contexts/UserContext";

import {
    saveBoard,
    getUserBoard,
    updateBoardWithoutPreview,
} from "../services/boardSaving";

import Toolbar from "../components/Toolbar";
import DraggableImage from "../components/DraggableImage";
import EditableText from "../components/EditableText";
import DatePicker from "../components/DatePicker";
import FloatingToolbar from "../components/FloatingToolbar";
import StickerLibrary from "../components/StickerLibrary";

import "../components/toolBar.css";
import "../styles/errorMessage.css";

import { useParams } from "react-router-dom";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const today = new Date().toISOString().split("T")[0];

const CreateBoard = () => {
    const [elements, setElements] = useState([]);

    const [loading, setLoading] = useState(false);

    const { datePath } = useParams();
    const initialDate = datePath || today; //if no datePath use today's date
    const [date, setDate] = useState(initialDate);

    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFont, setSelectedFont] = useState("Arial");

    const [saving, setSaving] = useState(false);

    const [exporting, setExporting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [showStickerLibrary, setShowStickerLibrary] = useState(false);

    const stageRef = useRef();
    const { user } = useUser();

    const selectedElement = elements.find((el) => el.id === selectedId);
    const isTextSelected = selectedElement?.type === "text";

    const latestDataRef = useRef({ elements, isPublic, user, date });

    useEffect(() => {
        latestDataRef.current = { elements, isPublic, user, date };

        localStorage.setItem(
            `scrapi-${user?.uid}-${date}`,
            JSON.stringify({ elements, isPublic })
        );

        return () => {
            const { elements, isPublic, user, date } = latestDataRef.current;

            if (elements?.length > 0) {
                updateBoardWithoutPreview({
                    elements,
                    user,
                    date,
                    public: isPublic,
                });
            }
        };
    }, [elements, isPublic, user, date]);

    useEffect(() => {
        if (user && date) {
            setLoading(true);
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
                    const cached = localStorage.getItem(
                        `scrapi-${user?.uid}-${date}`
                    );
                    if (cached) {
                        const { elements, isPublic } = JSON.parse(cached);
                        setElements(elements || []);
                        setIsPublic(isPublic || false);
                    } else {
                        setElements([]);
                    }
                })
                .finally(() => {
                    setLoading(false);
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

    const handleDeleteBoard = () => {
        if (
            !window.confirm(
                "Are you sure you want to delete the board? This cannot be undone."
            )
        )
            return;

        setElements([]);
        setHistory([]);
        setRedoStack([]);
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
        console.log("handleSaveBoard triggered");

        if (!user) {
            console.log("User not logged in, not saved");
            return;
        }

        if (!elements.length) {
            setError("Why don't you add something before saving 😏");
            return;
        }

        if (!stageRef.current) {
            console.error("stageRef.current is null or undefined");
            setError("Something went wrong please try again.");
            return;
        }
        console.log("stageRef.current is available");

        setSaving(true);

        try {
            // Get base64 image string
            const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

            // Convert base64 string to a Blob to upload to cloudinary
            function dataURLtoBlob(dataurl) {
                const arr = dataurl.split(",");
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }

            const blob = dataURLtoBlob(dataURL);

            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", UPLOAD_PRESET);

            console.log("Uploading preview image to Cloudinary...");
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            console.log("Cloudinary upload response:", data);

            if (!res.ok) {
                throw new Error(
                    data.error?.message || "Cloudinary upload failed"
                );
            }

            console.log("Preview image URL received:", data.secure_url);

            await saveBoard({
                elements,
                user,
                date,
                public: isPublic,
                previewImage: data.secure_url,
            });

            console.log("Board saved successfully with previewImage!");
        } catch (error) {
            console.error("Error in handleSaveBoard:", error);
            setError("Failed to save board. Try again?");
        } finally {
            setSaving(false);
        }
    };

    const exportToImage = () => {
        setExporting(true);

        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

        const link = document.createElement("a");
        link.download = "scrapi-board-export.png";
        link.href = dataURL;
        link.click();

        setExporting(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="whale">🐋</div>
                <div>loading page</div>
                <div className="dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
        );
    }

    if (saving) {
        return (
            <div className="loading-container">
                <div className="whale">🐋</div>
                <div>saving board</div>
                <div className="dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
        );
    }

    if (exporting) {
        return (
            <div className="loading-container">
                <div className="whale">🐋</div>
                <div>exporting image</div>
                <div className="dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
        );
    }

    if (uploading) {
        return (
            <div className="loading-container">
                <div className="whale">🐋</div>
                <div>uploading image</div>
                <div className="dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
        );
    }
    if (error)
        return (
            <div className="error-container">
                <button className="close-btn" onClick={() => setError(null)}>
                    ×
                </button>
                <div className="error-whale">🐳</div>
                <p className="error-text">{error}</p>
            </div>
        );
    return (
        <div className="create-board-page">
            <label className="toggle-container">
                Make public:
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="toggle-checkbox"
                />
                <span className="toggle-slider"></span>
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
                onSave={handleSaveBoard}
                onExport={exportToImage}
                onDeleteBoard={handleDeleteBoard}
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
