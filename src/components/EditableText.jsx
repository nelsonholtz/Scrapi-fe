import { useState, useRef, useEffect } from "react";
import { Html } from "react-konva-utils";
import TextComponent from "./TextComponent";

const EditableText = ({ id, text, x, y, onChange, onUpdate, stageRef }) => {
    const textNodeRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);

    const handleDoubleClick = ({ id, x, y, text }) => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        onChange(id, value);
        setIsEditing(false);
    };

    useEffect(() => {
        setValue(text);
    }, [text]);

    useEffect(() => {
        if (isEditing) {
            const textarea = document.getElementById(`textarea-${id}`);
            if (textarea) {
                textarea.focus();
                textarea.select();
            }
        }
    }, [isEditing]);

    return (
        <>
            <TextComponent
                id={id}
                x={x}
                y={y}
                text={value}
                onDoubleClick={handleDoubleClick}
                textRef={textNodeRef}
                onUpdate={onUpdate}
            />

            {isEditing && (
                <Html>
                    <textarea
                        id={`textarea-${id}`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                            if (e.key === "Escape") {
                                setIsEditing(false);
                            }
                        }}
                    />
                </Html>
            )}
        </>
    );
};

export default EditableText;
