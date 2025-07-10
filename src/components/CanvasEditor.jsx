
import { Stage, Layer } from "react-konva";
import { useRef, useState } from "react";
import DraggableImage from "./DraggableImage";
import EditableText from "./EditableText";
import Toolbar from "./Toolbar";

const CanvasEditor = () => {
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState(null)
  const stageRef = useRef();

  const pushToHistory = (newElements) => {
    const updated = [...history.slice(0, step + 1), newElements];
    setHistory(updated);
    setStep(updated.length - 1);
  };

  const addImage = () => {
    const newImage = {
      id: crypto.randomUUID(),
      type: "image",
      x: 200, 
      y: 200,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      src: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&h=350",
    };
    const updated = [...elements, newImage];
    setElements(updated);
    pushToHistory(updated);
  };

  const addText = () => {
    const newText = {
      id: crypto.randomUUID(),
      type: "text",
      text: "New Text",
      x: window.innerWidth / 2 - 50, 
      y: window.innerHeight / 2 - 10,
    };
    const updated = [...elements, newText];
    setElements(updated);
    pushToHistory(updated);
  };

  const handleChange = (updates) => {
    const updated = elements.map((el) => {
      el.id === updates.id ? {...el, ...updates} : el
    });
    setElements(updated)
    pushToHistory(updated)
  };

  const handleSelect = () => {
    setSelectedId(id)
  }

  const handleDelete = () => {
    if (selectedId) {
      const newElements = elements.filter((el) => el.id !== selectedId);
      setElements(newElements);
      setHistory([...history, elements]);
      setRedoStack([]);
      setSelectedId(null);
    }
  };
  

  const undo = () => {
    if (step > 0) {
      const prev = history[step - 1];
      setStep(step - 1);
      setElements(prev);
    }
  };

  const redo = () => {
    if (step < history.length - 1) {
      const next = history[step + 1];
      setStep(step + 1);
      setElements(next);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Toolbar onAddText={addText} onAddImage={addImage} onUndo={undo} onRedo={redo} onDelete={handleDelete} selectedId={selectedId}/>
      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
        <Layer>
          {elements.map((el) => {
            const isSelected = el.id === selectedId

            if (el.type === "image") {
              return (
                <DraggableImage
                  key={el.id}
                  {...el}
                  onSelect={() => setSelectedId(el.id)}
                  isSelected={selectedId === el.id}
                  onChange={handleChange}
                />
              );
            }
            if (el.type === "text") {
              return (
                <EditableText
                  key={el.id}
                  {...el}
                  onSelect={() => setSelectedId(el.id)}
                  isSelected={selectedId === el.id}
                  onChange={handleChange}
                  stageRef={stageRef}
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

export default CanvasEditor;
