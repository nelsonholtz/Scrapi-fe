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
    width: initialWidth = 200,
    onChange,
    onUpdate,
    stageRef,
    onSelect,
    isSelected,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);
    const [localFontSize, setLocalFontSize] = useState(fontSize);
    const [width, setWidth] = useState(200);
    const [activeAnchor, setActiveAnchor] = useState(null);

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

    useEffect(() => {
        setWidth(initialWidth);
    }, [initialWidth]);

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

    const onTransformStart = (e) => {
        const tr = transformerRef.current;
        setActiveAnchor(tr?.getActiveAnchor());
    };

    const handleTransformEnd = () => {
        const node = textRef.current;
        if (!node || !node.getParent()) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        if (activeAnchor === "middle-right") {
            const newWidth = Math.max(50, node.width() * scaleX);
            onUpdate(id, { width: newWidth });
            setWidth(newWidth);
        } else {
            const newFontSize = Math.max(8, node.fontSize() * scaleX);
            onUpdate(id, { fontSize: newFontSize });
            setLocalFontSize(newFontSize);
        }

        setActiveAnchor(null);

        onUpdate(id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
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
                            border: "2px solid #7ccbf8",
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
                    width={width}
                    wrap="word"
                    draggable
                    onClick={handleSelect}
                    onDblClick={handleDblClick}
                    onDragEnd={(e) => {
                        onUpdate(id, {
                            x: e.target.x(),
                            y: e.target.y(),
                        });
                    }}
                    onTransformStart={onTransformStart}
                    onTransformEnd={handleTransformEnd}
                />
            )}

            {!isEditing && textDecoration === "underline" && (
                <Text
                    x={x}
                    y={y + localFontSize + 2}
                    rotation={rotation}
                    text={"_".repeat(
                        Math.max(1, Math.floor(text.length * 0.8))
                    )}
                    fontSize={localFontSize * 0.1}
                    fontFamily={fontFamily}
                    fill={color}
                    listening={false}
                    wrap="word"
                    width={textProps.width || 200}
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
                        "middle-right",
                    ]}
                />
            )}
        </>
    );
};

export default EditableText;
