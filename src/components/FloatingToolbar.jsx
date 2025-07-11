import "../styles/toolbar-update.css";
import { MdDeleteForever } from "react-icons/md";
import { BiLayerPlus } from "react-icons/bi";
import { BiLayerMinus } from "react-icons/bi";
import { FaFont } from "react-icons/fa";

const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];

const FloatingToolbar = ({
    isTextSelected,
    onMoveUp,
    onMoveDown,
    onDelete,
    selectedFont,
    onFontChange,
}) => {
    return (
        <div className="floating-toolbar ">
            <ul>
                {isTextSelected && (
                    <li>
                        <select
                            value={selectedFont}
                            onChange={(e) => onFontChange(e.target.value)}
                        >
                            {fonts.map((font) => (
                                <option key={font} value={font}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </li>
                )}
                <li>
                    <button onClick={onMoveUp}>
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
