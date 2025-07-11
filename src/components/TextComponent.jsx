import { Text } from "react-konva";
import { forwardRef } from "react";

const TextComponent = forwardRef(
    (
        {
            text = "New Text",
            onDoubleClick,
            x = 100,
            y = 100,
            rotation,
            id,
            onUpdate,
            onClick,
            isSelected,
        },
        ref
    ) => {
        return (
            <Text
                ref={ref}
                text={text}
                x={x}
                y={y}
                rotation={rotation}
                draggable
                onDblClick={() => onDoubleClick?.({ id, x, y, text })}
                onDragEnd={(e) => {
                    onUpdate(id, {
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onClick={onClick}
                stroke={isSelected ? "blue" : undefined}
            />
        );
    }
);

export default TextComponent;
