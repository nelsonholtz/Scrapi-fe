import React from "react";
import { Stage, Layer, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const ImageElement = ({ src, x, y, scaleX = 1, scaleY = 1, rotation = 0 }) => {
    const [image] = useImage(src, "Anonymous");
    return image ? (
        <KonvaImage
            image={image}
            x={x}
            y={y}
            scaleX={scaleX}
            scaleY={scaleY}
            rotation={rotation}
        />
    ) : null;
};

const PostCard = ({ board }) => {
    const { userId, date, updatedAt, elements = [] } = board;

    const formattedDate = new Date(date).toLocaleDateString();
    const formattedUpdatedAt = updatedAt?.toDate?.().toLocaleString?.() || "";

    return (
        <div className="">
            <div className="">
                Created by: <span className="">{userId}</span>
            </div>
            <div className="">Board Date: {formattedDate}</div>
            <div className="">Last Updated: {formattedUpdatedAt}</div>

            <Stage width={600} height={600}>
                <Layer>
                    {elements.map((el) => {
                        if (el.type === "text") {
                            return (
                                <Text
                                    key={el.id}
                                    text={el.text}
                                    x={el.x}
                                    y={el.y}
                                    fontSize={12}
                                    fill="black"
                                />
                            );
                        }
                        if (el.type === "image" && el.src) {
                            return (
                                <ImageElement
                                    key={el.id}
                                    src={el.src}
                                    x={el.x}
                                    y={el.y}
                                    scaleX={el.scaleX}
                                    scaleY={el.scaleY}
                                    rotation={el.rotation}
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

export default PostCard;
