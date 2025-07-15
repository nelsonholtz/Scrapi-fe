import { useState, useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";

const EditableText = ({
    id,
    x,
    y,
    text,
    fontSize,
    fontFamily,
    color,
    stroke,
    strokeWidth,
    rotation,
    fontWeight = "normal",
    fontStyle = "normal",
    textDecoration = "none",
    onChange,
    onUpdate,
    stageRef,
    onSelect,
    isSelected,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);
    const [localFontSize, setLocalFontSize] = useState(fontSize);
    const inputRef = useRef();
    const textRef = useRef();
    const transformerRef = useRef();

  
    const konvaFontStyle = `${fontWeight} ${fontStyle}`.trim();

  

    useEffect(() => {
        if (isSelected && transformerRef.current && textRef.current) {
           
            if (textRef.current.getParent()) {
                transformerRef.current.nodes([textRef.current]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        } else if (transformerRef.current) {
          
            transformerRef.current.nodes([]);
        }
    }, [isSelected]);

    useEffect(() => {
        return () => {
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
            }
        };
    }, []);


    const handleSelect = () => {
        if (onSelect) onSelect(id);
    };

    const handleDblClick = () => {
        setIsEditing(true);
        
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== text) {
            onChange(id, value);
            onUpdate(id, { text: value });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current.blur();
        }
    };

    const handleTransformEnd = () => {
        const node = textRef.current;
        if (!node || !node.getParent()) return;

        const scaleX = node.scaleX();

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
                <Html
                    groupProps={{
                        x: x,
                        y: y,
                        rotation: rotation,
                    }}
                >
                    <input
                        ref={inputRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            fontSize: localFontSize + "px",
                            fontFamily: fontFamily,
                            fontWeight: fontWeight,
                            fontStyle: fontStyle,
                            textDecoration: textDecoration,
                            color: color,
                            padding: "0px",
                            margin: "0px",
                            border: "2px solid #007bff",
                            background: "rgba(255, 255, 255, 0.95)",
                            outline: "none",
                            zIndex: 1000,
                            minWidth: "20px",
                            resize: "none",
                        }}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                </Html>
            ) : (
                <Text
                    x={x}
                    y={y}
                    rotation={rotation}
                    ref={textRef}
                    text={text}
                    fontSize={localFontSize}
                    fontFamily={fontFamily}
                    fontStyle={konvaFontStyle}
                    fill={color}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    draggable
                    onClick={handleSelect}
                    onDblClick={handleDblClick}
                    onDragEnd={(e) => {
                        onUpdate(id, {
                            x: e.target.x(),
                            y: e.target.y(),
                        });
                    }}
                    onTransformEnd={handleTransformEnd}
                />
            )}
           
            {!isEditing && textDecoration === "underline" && (
                <Text
                    x={x}
                    y={y + localFontSize + 2}
                    rotation={rotation}
                    text={"_".repeat(Math.max(1, Math.floor(text.length * 0.8)))}
                    fontSize={localFontSize * 0.1}
                    fontFamily={fontFamily}
                    fill={color}
                    listening={false}
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
