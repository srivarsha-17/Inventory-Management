import { useState, useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, type = "success", duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button
        className="toast-close"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>
    </div>
  );
}
