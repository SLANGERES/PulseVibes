import React from "react";
import "./Loading.css"; // Import external CSS

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ul className="wave-menu">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index}></li>
        ))}
      </ul>
    </div>
  );
}
