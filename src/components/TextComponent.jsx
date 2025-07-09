import { Text } from "react-konva";
import { forwardRef } from "react";

const TextComponent = forwardRef(
  ({ text = "New Text", onDoubleClick, x = 100, y = 100, id }, ref) => {
    return (
      <Text
        ref={ref}
        text={text}
        x={x}
        y={y}
        draggable
        onDblClick={() => onDoubleClick?.({ id, x, y, text })}
      />
    );
  }
);

export default TextComponent;
