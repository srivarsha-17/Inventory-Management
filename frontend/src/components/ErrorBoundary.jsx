import { useState } from "react";

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    return (
      <div style={{
        padding: "20px",
        margin: "20px",
        border: "2px solid #ff6b6b",
        borderRadius: "8px",
        backgroundColor: "#ffe0e0",
        textAlign: "center"
      }}>
        <h2>Oops! Something went wrong</h2>
        <p>{error?.message || "An unexpected error occurred"}</p>
        <button
          onClick={resetError}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return children;
}
