import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
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
import ToolbarWrapper from "../components/ToolbarWrapper";
import StickerLibrary from "../components/StickerLibrary";
import Loading from "../components/Loading";
import DrawingTool from "../components/drawing";

import "../components/toolBar.css";
import "../styles/errorMessage.css";

import { useParams } from "react-router-dom";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const today = new Date().toISOString().split("T")[0];

const CreateBoard = () => {
  const [elements, setElements] = useState([]);

  const [backgroundColor, setBackgroundColor] = useState({
    r: 255,
    g: 255,
    b: 255,
  }); // 👉 NEW
  const [loading, setLoading] = useState(false);

  const { datePath } = useParams();
  const initialDate = datePath || today;
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
  const [isStrokeEnabled, setIsStrokeEnabled] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ffffff");

  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("none");

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [tool, setTool] = useState("brush");

  const isDrawing = useRef(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

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
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
          const cached = localStorage.getItem(`scrapi-${user?.uid}-${date}`);
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
    const clone = JSON.parse(JSON.stringify(newElements));
    setHistory((prev) => [...prev, clone]);
    setRedoStack([]);
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
        ...(elementType === "text" && {
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
        }),
      };
      setElements((prev) => {
        const newElements = [...prev, newElement];
        pushToHistory(newElements);
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
      setRedoStack([]);
      setHistory((prevHistory) => [...prevHistory, cloned]);

      return newElements;
    });
  };
  const handleToggleStroke = () => {
    if (isTextSelected && selectedId) {
      const newEnabled = !isStrokeEnabled;
      setIsStrokeEnabled(newEnabled);

      handleUpdateElement(selectedId, {
        stroke: newEnabled ? strokeColor : null,
        strokeWidth: newEnabled ? 2 : 0,
      });
    }
  };

  const handleStrokeColorChange = (color) => {
    setStrokeColor(color);

    if (isTextSelected && selectedId && isStrokeEnabled) {
      handleUpdateElement(selectedId, {
        stroke: color,
      });
    }
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

    setSelectedId(null);

    setElements((prev) => {
      const newElements = prev.filter((el) => el.id !== selectedId);
      pushToHistory(newElements);
      return newElements;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setSelectedId(null);

    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, [...elements]]);
    setHistory((prev) => prev.slice(0, -1));
    setElements(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setHistory((prev) => [...prev, [...elements]]);

    setElements(next);

    setSelectedId(null);
  };

  const handleDeleteBoard = () => {
    setDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setElements([]);
    setHistory([]);
    setRedoStack([]);
    setSelectedId(null);
    setDeleteConfirmation(false);
  };

  const handleDrawingMouseDown = (e) => {
    if (!isDrawingMode) return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();

    const newLine = {
      id: uuidv4(),
      type: "drawing",
      tool,
      points: [pos.x, pos.y],
    };

    setElements((prev) => {
      const updated = [...prev, newLine];
      pushToHistory(updated);
      return updated;
    });
  };

  const handleDrawingMouseMove = (e) => {
    if (!isDrawingMode || !isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setElements((prev) => {
      const last = prev[prev.length - 1];
      if (last.type !== "drawing") return prev;

      const updatedLast = {
        ...last,
        points: [...last.points, point.x, point.y],
      };

      const updated = [...prev.slice(0, -1), updatedLast];
      return updated;
    });
  };

  const handleDrawingMouseUp = () => {
    if (!isDrawingMode) return;
    isDrawing.current = false;
  };

  const moveLayer = (direction) => {
    setElements((prev) => {
      const index = prev.findIndex((element) => element.id === selectedId);
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
        throw new Error(data.error?.message || "Cloudinary upload failed");
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

  const handleFormatChange = (property, value) => {
    if (isTextSelected && selectedId) {
      handleUpdateElement(selectedId, {
        [property]: value,
      });

      if (property === "fontWeight") setFontWeight(value);
      if (property === "fontStyle") setFontStyle(value);
      if (property === "textDecoration") setTextDecoration(value);
    }
  };

  useEffect(() => {
    if (isTextSelected && selectedElement) {
      setFontWeight(selectedElement.fontWeight || "normal");
      setFontStyle(selectedElement.fontStyle || "normal");
      setTextDecoration(selectedElement.textDecoration || "none");
    }
  }, [selectedId, isTextSelected, selectedElement]);

  if (loading) {
    return <Loading state={"loading"} />;
  }

  if (saving) {
    return <Loading state={"saving"} />;
  }

  if (exporting) {
    return <Loading state={"exporting"} />;
  }

  if (uploading) {
    return <Loading state={"uploading"} />;
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

  if (deleteConfirmation)
    return (
      <div className="error-container">
        <button
          className="close-btn"
          onClick={() => setDeleteConfirmation(false)}
        >
          ×
        </button>
        <div className="error-whale">🗑️</div>
        <p className="error-text">
          Are you sure you want to delete the board? This cannot be undone.
        </p>
        <div className="confirm-buttons">
          <button className="confirm-btn" onClick={handleConfirmDelete}>
            Yes, delete
          </button>
          <button
            className="confirm-btn"
            onClick={() => setDeleteConfirmation(false)}
          >
            Cancel
          </button>
        </div>
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
        onUploadingComplete={handleAddImageElement}
        onUploadError={(msg) => setError(msg)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDelete={handleDelete}
        selectedId={selectedId}
        onOpenStickerLibrary={() => setShowStickerLibrary(true)}
        onSave={handleSaveBoard}
        onExport={exportToImage}
        onDeleteBoard={handleDeleteBoard}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onBackgroundColorChange={setBackgroundColor} // 👉
        onUploadingStart={() => setUploading(true)}
        onUploadingEnd={() => setUploading(false)}
        isDrawingMode={isDrawingMode}
        setIsDrawingMode={setIsDrawingMode}
        tool={tool}
        setTool={setTool}
      />

      <StickerLibrary
        isOpen={showStickerLibrary}
        onClose={() => setShowStickerLibrary(false)}
        onSelectSticker={(src) => handleAddElement("image", { src })}
      />
      <div className="stage-div">
        <Stage
          width={window.innerWidth * 0.7}
          height={window.innerHeight * 0.7}
          onMouseDown={(e) => {
            const clickedOn = e.target;

            if (isDrawingMode) {
              handleDrawingMouseDown(e);
            } else if (
              clickedOn === clickedOn.getStage() ||
              clickedOn.name() === "background"
            ) {
              setSelectedId(null);
            }
          }}
          ref={stageRef}
          onMouseMove={handleDrawingMouseMove}
          onMouseUp={handleDrawingMouseUp}
        >
          <Layer>
            {/* 👉 Background layer rendered behind everything */}
            <Rect
              name="background"
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              fill={`rgb(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b})`}
            />
          </Layer>
          <Layer>
            {elements.map((element) => {
              if (element.type === "drawing") {
                return (
                  <Line
                    key={element.id}
                    points={element.points}
                    stroke="#3d2620ff"
                    strokeWidth={element.tool === "eraser" ? 20 : 5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      element.tool === "eraser"
                        ? "destination-out"
                        : "source-over"
                    }
                  />
                );
              }
              return null;
            })}
          </Layer>
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
                    color={element.color}
                    stroke={element.stroke || null}
                    strokeWidth={element.stroke ? element.strokeWidth || 2 : 0}
                    fontSize={element.fontSize || 20}
                    rotation={element.rotation}
                    fontWeight={element.fontWeight || "normal"}
                    fontStyle={element.fontStyle || "normal"}
                    textDecoration={element.textDecoration || "none"}
                    width={element.width || 200}
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
      </div>

      {selectedId && (
        <ToolbarWrapper
          onMoveUp={() => moveLayer("up")}
          onMoveDown={() => moveLayer("down")}
          onDelete={handleDelete}
          isTextSelected={isTextSelected}
          selectedFont={
            isTextSelected ? selectedElement?.fontFamily || "Arial" : undefined
          }
          onFontChange={(newFont) => {
            if (isTextSelected && selectedId) {
              handleUpdateElement(selectedId, {
                fontFamily: newFont,
              });
            }
          }}
          selectedColour={
            isTextSelected ? selectedElement?.color || "#000000" : "#000000"
          }
          onColourChange={(newColor) => {
            if (isTextSelected && selectedId) {
              handleUpdateElement(selectedId, {
                color: newColor,
              });
            }
          }}
          isStrokeEnabled={isStrokeEnabled}
          onToggleStroke={handleToggleStroke}
          strokeColor={strokeColor}
          onStrokeColorChange={handleStrokeColorChange}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          textDecoration={textDecoration}
          onFormatChange={handleFormatChange}
        />
      )}
    </div>
  );
};

export default CreateBoard;
