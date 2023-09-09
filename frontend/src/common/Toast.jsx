import React, { useState, useEffect } from "react";

function Toast({ err, errState }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (err) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Hide the toast after 3 seconds
    }
  }, [err]);

  return (
    <div
      id="toast-top-right"
      className={`z-50 fixed flex items-center w-full max-w-xs p-4 space-x-4 divide-x rounded-2xl shadow top-20 right-5 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: "#2f2f2f",
        border: "2px solid #C39601",
      }}
      role="alert"
    >
      <div
        className={`text-sm font-light ${
          errState ? "text-red-500" : "text-green-500"
        }`}
      >
        {err}
      </div>
    </div>
  );
}

export default Toast;
