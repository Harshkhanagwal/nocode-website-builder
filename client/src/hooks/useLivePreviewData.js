import { useEffect, useState } from "react";

const useLivePreviewData = (serverData) => {
    const [data, setData] = useState(serverData);

    // keep in sync when the server data loads or changes
    useEffect(() => {
        setData(serverData);
    }, [serverData]);

    useEffect(() => {
        // only run when this page is inside the editor's iframe
        if (window.parent === window) return;

        const onMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === "PREVIEW_UPDATE") {
                setData(event.data.website);
            }
        };

        window.addEventListener("message", onMessage);

        // tell the editor this page is ready to receive updates
        window.parent.postMessage({ type: "PREVIEW_READY" }, window.location.origin);

        return () => window.removeEventListener("message", onMessage);
    }, []);

    return data;
};

export default useLivePreviewData;