import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../contexts/UserContext";
import { saveBoard, getUserBoard } from "../services/boardSaving";

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
  const [backgroundColor, setBackgroundColor] = useState({ r: 255, g: 255, b: 255 }); // 👉 NEW
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

  const stageRef = useRef();
  const { user } = useUser();

  const selectedElement = elements.find((el) => el.id === selectedId);
  const isTextSelected = selectedElement?.type === "text";

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

  const handleSaveBoard = async () => {
    if (!user) return;
    if (!elements.length) {
      setError("Why don't you add something before saving 😏");
      return;
    }
    if (!stageRef.current) {
      setError("Something went wrong please try again.");
      return;
    }
    setSaving(true);
    try {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
      }
      const blob = dataURLtoBlob(dataURL);
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed");
      await saveBoard({
        elements,
        user,
        date,
        public: isPublic,
        previewImage: data.secure_url,
      });
    } catch (error) {
      console.error("Error in handleSaveBoard:", error);
      setError("Failed to save board. Try again?");
    } finally {
      setSaving(false);
    }
  };

  const handleAddElement = useCallback((elementType, elementData) => {
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
      const beforeChange = JSON.parse(JSON.stringify(prev));
      const newElements = [...prev, newElement];
      setHistory((prevHist) => [...prevHist, beforeChange]);
      setRedoStack([]);
      return newElements;
    });
  }, []);

  const handleAddImageElement = useCallback((imageUrl) => {
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
    }
  }, [pushToHistory]);

  const handleTextChange = (id, newText) => {
    setElements((prev) => {
      const newElements = prev.map((el) => el.id === id ? { ...el, text: newText } : el);
      const cloned = JSON.parse(JSON.stringify(newElements));
      setRedoStack([]);
      setHistory((prevHistory) => [...prevHistory, cloned]);
      return newElements;
    });
  };

  const handleUpdateElement = (id, updates) => {
    setElements((prev) => {
      const newElements = prev.map((el) => el.id === id ? { ...el, ...updates } : el);
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
    if (!window.confirm("Are you sure you want to delete the board? This cannot be undone.")) return;
    setElements([]);
    setHistory([]);
    setRedoStack([]);
    setSelectedId(null);
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

  if (loading || saving || exporting || uploading) {
    const status = loading ? "loading page" : saving ? "saving board" : exporting ? "exporting image" : "uploading image";
    return (
      <div className="loading-container">
        <div className="whale">🐋</div>
        <div>{status}</div>
        <div className="dots">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <button className="close-btn" onClick={() => setError(null)}>×</button>
        <div className="error-whale">🐳</div>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="create-board-page">
      <button onClick={handleSaveBoard}>Save 💾</button>
      <button onClick={exportToImage}>Export 📤</button>
      <button onClick={handleDeleteBoard} className="toolbar-button delete">🗑️ Delete Board</button>

      <label className="toggle-container">
        Make public?
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
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onBackgroundColorChange={setBackgroundColor} // 👉 Added
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
          if (e.target === e.target.getStage()) setSelectedId(null);
        }}
      >
        <Layer>
          {/* 👉 Background layer rendered behind everything */}
          <Rect
            x={0}
            y={0}
            width={window.innerWidth}
            height={window.innerHeight}
            fill={`rgb(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b})`}
          />
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
          selectedFont={isTextSelected ? selectedElement?.fontFamily || "Arial" : undefined}
          onFontChange={(newFont) => {
            if (isTextSelected && selectedId) {
              handleUpdateElement(selectedId, { fontFamily: newFont });
            }
          }}
        />
      )}
    </div>
  );
};

export default CreateBoard;
