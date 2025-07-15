import { useState, useEffect } from "react";
import FontFaceObserver from "fontfaceobserver";

export function fontLoader(fonts) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!fonts || fonts.length === 0) {
            setLoaded(true);
            return;
        }

        Promise.all(
            fonts.map((fontName) =>
                new FontFaceObserver(fontName).load().catch(() => {
                    console.warn(`Failed to load font: ${fontName}`);
                })
            )
        ).then(() => setLoaded(true));
    }, [fonts]);

    return loaded;
}
