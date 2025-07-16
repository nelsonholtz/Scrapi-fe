import "../styles/toolbar-update.css";
import { MdDeleteForever } from "react-icons/md";
import { BiLayerPlus } from "react-icons/bi";
import { BiLayerMinus } from "react-icons/bi";
import { MdFormatBold, MdFormatItalic} from "react-icons/md";
import { webFonts, systemFonts } from "../utils/fonts";
import { MdOutlineTextFields } from "react-icons/md";

const allFonts = [...webFonts, ...systemFonts];
const FloatingToolbar = ({
    isTextSelected,
    onMoveUp,
    onMoveDown,
    onDelete,
    selectedFont,
    onFontChange,
    selectedColour,
    onColourChange,
    isStrokeEnabled,
    onToggleStroke,
    strokeColor,
    onStrokeColorChange,
    fontWeight,
    fontStyle,
    textDecoration,
    onFormatChange,
}) => {
    return (
        <div className="floating-toolbar ">
            <ul>
                {isTextSelected && (
                    <>
                        <li>
                            <select
                                value={selectedFont}
                                onChange={(e) => onFontChange(e.target.value)}
                            >
                                {allFonts.map((font) => (
                                    <option key={font} value={font}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </li>
                        
                       
                        <li className="formatting-group">
                            <button
                                className={`format-btn ${fontWeight === 'bold' ? 'active' : ''}`}
                                onClick={() => onFormatChange('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
                                title="Bold"
                            >
                                <MdFormatBold />
                            </button>
                            <button
                                className={`format-btn ${fontStyle === 'italic' ? 'active' : ''}`}
                                onClick={() => onFormatChange('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
                                title="Italic"
                            >
                                <MdFormatItalic />
                            </button>
                            
                        </li>

                        <li>
                            <input
                                type="color"
                                value={selectedColour}
                                onChange={(e) => onColourChange(e.target.value)}
                                title="Select text color"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                }}
                            />
                        </li>
                        <li>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isStrokeEnabled}
                                    onChange={onToggleStroke}
                                    title="Toggle outline"
                                />
                                Outline
                            </label>
                        </li>
                        {isStrokeEnabled && (
                            <li>
                                <input
                                    type="color"
                                    value={strokeColor}
                                    onChange={(e) =>
                                        onStrokeColorChange(e.target.value)
                                    }
                                    title="Outline color"
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                    }}
                                />
                            </li>
                        )}
                    </>
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
