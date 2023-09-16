import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "../index.css";

function Toast({ err, errState }) {
  const [isVisible, setIsVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (err) {
      setIsVisible(true);
      setKey((prevKey) => prevKey + 1);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  }, [err]);

  return (
    <div
      id="toast-top-right"
      className={`z-50 fixed flex items-center w-full max-w-xs p-4 space-x-4 divide-x rounded-2xl  top-24  shadow-lg ${
        isVisible ? "slide-in" : "slide-out"
      }`}
      style={{
        backgroundColor: "#2f2f2f",
        border: "1px solid #C39601 ",
      }}
      role="alert"
    >
      <CountdownCircleTimer
        isPlaying
        key={key}
        duration={3}
        colors={["#C39601"]}
        colorsTime={[3]}
        // onComplete={() => ({ shouldRepeat: true, delay: 1 })}
        size={25}
        strokeWidth={2}
      ></CountdownCircleTimer>
      <div
        className={`text-sm font-medium ${
          errState ? "text-red-500" : "text-green-500"
        }`}
        style={{ border: "0px" }}
      >
        {err}
      </div>
    </div>
  );
}

export default Toast;
