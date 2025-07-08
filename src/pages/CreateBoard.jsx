import { useState, useRef, useCallback } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import Toolbar from "../components/Toolbar";
import DraggableImage from "../components/DraggableImage";
import EditableText from "../components/EditableText";
import LogOut from "../components/LoginComponents/LogOut";

const CreateBoard = () => {
    const [elements, setElements] = useState([]);

    const stageRef = useRef();

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
        );
    };
    return (
        <>
            <LogOut />
            <Toolbar
                onAddText={() => handleAddElement("text", { text: "New Text" })}
            />

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <Layer>
                    {elements.map((element) =>
                        element.type === "text" ? (
                            <EditableText
                                key={element.id}
                                id={element.id}
                                text={element.text}
                                x={element.x}
                                y={element.y}
                                onChange={handleTextChange}
                                stageRef={stageRef}
                            />
                        ) : null
                    )}
                    <DraggableImage />
                </Layer>
            </Stage>
        </>
    );
};

export default CreateBoard;
