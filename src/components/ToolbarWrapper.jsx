import FloatingToolbar from "./FloatingToolbar";
import { webFonts } from "../utils/fonts";
import { fontLoader } from "../utils/fontLoader";

const ToolbarWrapper = (props) => {
    const fontsReady = fontLoader(webFonts);

    if (!fontsReady) {
        return <div>Loading fonts...</div>;
    }

    return <FloatingToolbar {...props} />;
};

export default ToolbarWrapper;
