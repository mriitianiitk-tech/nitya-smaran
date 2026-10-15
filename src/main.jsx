import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Register Service Worker for PWA
if ("serviceWorker" in navigator && !window.location.host.includes("localhost:5173000")) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(err => {
            console.log("Service Worker registration optional:", err);
        });
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);