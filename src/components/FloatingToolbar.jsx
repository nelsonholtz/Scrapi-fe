import "../styles/toolbar-update.css";
import { MdDeleteForever } from "react-icons/md";
import { BiLayerPlus } from "react-icons/bi";
import { BiLayerMinus } from "react-icons/bi";

const FloatingToolbar = ({ onMoveUp, onMoveDown, onDelete }) => {
    return (
        <div className="floating-toolbar ">
            <ul>
                <li>
                    <button className="toolbar-button" onClick={onMoveUp}>
                        <BiLayerPlus />
                    </button>
                </li>
                <li>
                    <button onClick={onMoveDown}>
                        <BiLayerMinus />
                    </button>
                </li>
                <li>
                    <button className="delete-button" onClick={onDelete}>
                        <MdDeleteForever />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default FloatingToolbar;
