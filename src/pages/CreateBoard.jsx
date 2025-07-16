import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import useImage from "use-image";

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

import "../components/toolBar.css";
import "../styles/errorMessage.css";

import { useParams } from "react-router-dom";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const today = new Date().toISOString().split("T")[0];

const BackgroundImage = ({ src }) => {
  const [image] = useImage(src);
  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

const CreateBoard = () => {
  const [elements, setElements] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState({ r: 255, g: 255, b: 255 });
  const [backgroundImage, setBackgroundImage] = useState(null); // 👉 new
  const [loading, setLoading] = useState(false);
  const { datePath } = useParams();
  const initialDate = datePath || today;
  const [date, setDate] = useState(initialDate);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [showStickerLibrary, setShowStickerLibrary] = useState(false); // 👉 toggle
  const [isStrokeEnabled, setIsStrokeEnabled] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("none");
  const [selectedFont, setSelectedFont] = useState("Arial");

  const stageRef = useRef();
  const { user } = useUser();

  const selectedElement = elements.find((el) => el.id === selectedId);
  const isTextSelected = selectedElement?.type === "text";

  const latestDataRef = useRef({ elements, isPublic, user, date });

  useEffect(() => {
    latestDataRef.current = { elements, isPublic, user, date };
    localStorage.setItem(`scrapi-${user?.uid}-${date}`, JSON.stringify({ elements, isPublic }));
    return () => {
      const { elements, isPublic, user, date } = latestDataRef.current;
      if (elements?.length > 0) {
        updateBoardWithoutPreview({ elements, user, date, public: isPublic });
      }
    };
  }, [elements, isPublic, user, date]);

  const pushToHistory = useCallback((newElements) => {
    const clone = JSON.parse(JSON.stringify(newElements));
    setHistory((prev) => [...prev, clone]);
    setRedoStack([]);
  }, []);

  useEffect(() => {
    if (user && date) {
      setLoading(true);
      getUserBoard(user.uid, date)
        .then((board) => {
          const loadedElements = board?.elements || [];
          setElements(loadedElements);
          setIsPublic(!!board?.public);
          pushToHistory(loadedElements); // 👉 push initial state
        })
        .catch((err) => {
          setError(err);
          const cached = localStorage.getItem(`scrapi-${user?.uid}-${date}`);
          if (cached) {
            const { elements, isPublic } = JSON.parse(cached);
            setElements(elements || []);
            setIsPublic(isPublic || false);
            pushToHistory(elements || []); // 👉 push cached too
          } else {
            setElements([]);
            pushToHistory([]); // 👉 empty
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, date, pushToHistory]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, elements]);
    setHistory((prev) => prev.slice(0, -1));
    setElements(previous);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setElements((prev) => {
      const next = prev.filter((el) => el.id !== selectedId);
      pushToHistory(next); // 👉 even if next is empty
      return next;
    });
    setSelectedId(null);
  };

  const handleAddElement = useCallback((type, data) => {
    const newElement = {
      id: uuidv4(),
      type,
      ...data,
      x: 200,
      y: 200,
      text: data?.text || "text",
      fontSize: 20,
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
    };
    setElements((prev) => {
      const next = [...prev, newElement];
      pushToHistory(next);
      return next;
    });
  }, [pushToHistory]);

  const handleOpenStickerLibrary = (value) => {
    setShowStickerLibrary(value); // 👉 fix toggle
  };

  return (
    <div className="create-board-page">
      <Toolbar
        onAddText={() => handleAddElement("text", { text: "New Text" })}
        onUploadingComplete={(url) => handleAddElement("image", { src: url })}
        onUploadError={(msg) => setError(msg)}
        onUndo={handleUndo}
        onRedo={() => {
          if (redoStack.length === 0) return;
          const next = redoStack[redoStack.length - 1];
          setRedoStack((prev) => prev.slice(0, -1));
          setHistory((prev) => [...prev, elements]);
          setElements(next);
        }}
        onDelete={handleDelete}
        selectedId={selectedId}
        onOpenStickerLibrary={handleOpenStickerLibrary}
        onSave={() => {}}
        onExport={() => {}}
        onDeleteBoard={() => {
          setElements([]);
          pushToHistory([]); // 👉 record cleared board
          setHistory([]);
          setRedoStack([]);
          setSelectedId(null);
        }}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onBackgroundColorChange={setBackgroundColor}
        onBackgroundImageChange={setBackgroundImage}
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
          {backgroundImage ? (
            <BackgroundImage src={backgroundImage} />
          ) : (
            <Rect
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              fill={`rgb(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b})`}
            />
          )}
        </Layer>

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
                  fontFamily={element.fontFamily || "Arial"}
                  color={element.color || "#000000"}
                  fontSize={element.fontSize || 20}
                  rotation={element.rotation || 0}
                  fontWeight={element.fontWeight || "normal"}
                  fontStyle={element.fontStyle || "normal"}
                  textDecoration={element.textDecoration || "none"}
                  onChange={(id, text) => {
                    setElements((prev) => prev.map((el) => el.id === id ? { ...el, text } : el));
                  }}
                  onUpdate={(id, updates) => {
                    setElements((prev) => {
                      const next = prev.map((el) => el.id === id ? { ...el, ...updates } : el);
                      pushToHistory(next);
                      return next;
                    });
                  }}
                  isSelected={selectedId === element.id}
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
                  isSelected={selectedId === element.id}
                  onSelect={() => setSelectedId(element.id)}
                  onUpdate={(id, updates) => {
                    setElements((prev) => {
                      const next = prev.map((el) => el.id === id ? { ...el, ...updates } : el);
                      pushToHistory(next);
                      return next;
                    });
                  }}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>

      {selectedId && (
        <FloatingToolbar
          isTextSelected={isTextSelected}
          onMoveUp={() => {}}
          onMoveDown={() => {}}
          onDelete={handleDelete}
          selectedFont={selectedElement?.fontFamily || "Arial"}
          onFontChange={(font) => {
            if (isTextSelected) {
              setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, fontFamily: font } : el));
            }
          }}
          selectedColour={selectedElement?.color || "#000000"}
          onColourChange={(color) => {
            if (isTextSelected) {
              setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, color } : el));
            }
          }}
          isStrokeEnabled={isStrokeEnabled}
          onToggleStroke={() => {
            const newStroke = !isStrokeEnabled;
            setIsStrokeEnabled(newStroke);
            if (isTextSelected) {
              setElements((prev) => prev.map((el) => el.id === selectedId ? {
                ...el,
                stroke: newStroke ? strokeColor : null,
                strokeWidth: newStroke ? 2 : 0,
              } : el));
            }
          }}
          strokeColor={strokeColor}
          onStrokeColorChange={(color) => {
            setStrokeColor(color);
            if (isTextSelected && isStrokeEnabled) {
              setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, stroke: color } : el));
            }
          }}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          textDecoration={textDecoration}
          onFormatChange={(property, value) => {
            if (isTextSelected) {
              setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, [property]: value } : el));
              if (property === "fontWeight") setFontWeight(value);
              if (property === "fontStyle") setFontStyle(value);
              if (property === "textDecoration") setTextDecoration(value);
            }
          }}
        />
      )}
    </div>
  );
};

export default CreateBoard;