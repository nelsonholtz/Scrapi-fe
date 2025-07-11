import { useRef, useEffect, useState } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const DraggableImage = ({
    id,
    src,
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    rotation = 0,
    onUpdate,
    onSelect,
    isSelected,
}) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const [position, setPosition] = useState({
        x,
        y,
        scaleX,
        scaleY,
        rotation,
    });

    // We use refs to keep history to avoid unnecessary re-renders
    const history = useRef([
        { x: 20, y: 20, scaleX: 1, scaleY: 1, rotation: 0 },
    ]);
    const historyStep = useRef(0);

    const [image] = useImage(src, "anonymous");

    const imageRef = useRef();
    const transformerRef = useRef();

    // const handleUndo = () => {
    //     if (historyStep.current === 0) {
    //         return;
    //     }
    //     historyStep.current -= 1;
    //     const previous = history.current[historyStep.current];
    //     setPosition(previous);
    // };

    // const handleRedo = () => {
    //     if (historyStep.current === history.current.length - 1) {
    //         return;
    //     }
    //     historyStep.current += 1;
    //     const next = history.current[historyStep.current];
    //     setPosition(next);
    // };

    useEffect(() => {
        // Attach transformer when selected
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected, image]);

    const handleDragTransformEnd = (e) => {
        const node = shapeRef.current;
        onUpdate(id, {
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
        });
    };

    return (
        <>
            <Image
                ref={shapeRef}
                image={image}
                x={x}
                y={y}
                scaleX={scaleX}
                scaleY={scaleY}
                rotation={rotation}
                draggable
                onClick={onSelect}
                onTransformEnd={handleDragTransformEnd}
                onDragEnd={handleDragTransformEnd}
            />
            {isSelected && <Transformer ref={trRef} />}
        </>
    );
};

export default DraggableImage;
