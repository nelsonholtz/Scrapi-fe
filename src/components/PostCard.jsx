import React from "react";
import { Stage, Layer, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const PostCard = ({ board }) => {
    const { userId, date, updatedAt, elements = [], previewImage } = board;

    const formattedDate = new Date(date).toLocaleDateString();
    const formattedUpdatedAt = updatedAt?.toDate?.().toLocaleString?.() || "";

    return (
        <li>
            <div className="">
                <div className="">
                    Created by: <span className="">{userId}</span>
                </div>
                <div className="">Board Date: {formattedDate}</div>
                <div className="">Last Updated: {formattedUpdatedAt}</div>
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt={`Board by ${userId}`}
                        className="w-full h-auto object-contain rounded-md"
                    />
                ) : (
                    <p className="text-gray-400 italic">No preview available</p>
                )}
            </div>
        </li>
    );
};

export default PostCard;
