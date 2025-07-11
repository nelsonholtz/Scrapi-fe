import { useState, useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";

const EditableText = ({
    id,
    x,
    y,
    text,
    fontSize,
    rotation,
    onChange,
    onUpdate,
    stageRef,
    onSelect,
    isSelected,
}) => {
    const [isEditing, setIsEditing] = useState(false); // Same var names
    const [value, setValue] = useState(text); //Initialize input with current text
    const [localFontSize, setLocalFontSize] = useState(fontSize);
    const inputRef = useRef();
    const textRef = useRef();
    const transformerRef = useRef();

    useEffect(() => {
        if (isSelected && transformerRef.current && textRef.current) {
            transformerRef.current.nodes([textRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const handleSelect = () => {
        if (onSelect) {
            onSelect(id);
        }
    };

    const handleDblClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus(); // Focus after render
        }, 0);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== text) {
            onChange(id, value); //Update elements with final value
            onUpdate(id, { text: value }); //Push final value to history
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current.blur(); //Save on Enter key
        }
    };

    const handleTransformEnd = () => {
        const node = textRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        const newFontSize = node.fontSize() * scaleX;
        setLocalFontSize(newFontSize);

        onUpdate(id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: newFontSize,
        });
    };

    return (
        <>
            {isEditing ? (
                <Html>
                    <input
                        ref={inputRef}
                        style={{
                            position: "absolute",
                            top: y + stageRef.current.container().offsetTop,
                            left: x + stageRef.current.container().offsetLeft,
                            fontSize: 20,
                            border: "1px solid black",
                            padding: "2px",
                            zIndex: 1000,
                        }}
                        value={value} // Controlled input
                        onChange={(e) => setValue(e.target.value)} // Live input update
                        onBlur={handleBlur} // Save on blur
                        onKeyDown={handleKeyDown}
                    />
                </Html>
            ) : (
                <Text
                    x={x}
                    y={y}
                    rotation={rotation}
                    ref={textRef}
                    text={text} //Shows correct text from props
                    fontSize={localFontSize}
                    draggable
                    onClick={handleSelect}
                    onDblClick={handleDblClick}
                    onDragEnd={(e) => {
                        onUpdate(id, {
                            x: e.target.x(),
                            y: e.target.y(),
                        }); // Update text position
                    }}
                    onTransformEnd={handleTransformEnd}
                />
            )}
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    enabledAnchors={[
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                    ]}
                />
            )}
        </>
    );
};

export default EditableText;
