import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Register Service Worker for PWA with Auto-Update
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((reg) => {
            // Check for updates on load
            reg.update();

            // When new SW installs and activates, reload to show latest version
            let refreshing = false;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        }).catch(err => {
            console.log("Service Worker registration optional:", err);
        });
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);