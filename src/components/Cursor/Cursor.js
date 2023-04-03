import React, { useState, useEffect } from "react";
import "./Cursor.scss";

// const Cursor = () => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const onMouseMove = (e) => {
//     setPosition({ x: e.clientX, y: e.clientY });
//   };

//   useEffect(() => {
//     document.addEventListener("mousemove", onMouseMove);

//     return () => {
//       document.removeEventListener("mousemove", onMouseMove);
//     };
//   }, []);

//   return (
//     <div
//       className="cursor"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//       }}
//     />
//   );
// };

// const Cursor = () => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const onMouseMove = (e) => {
//     setPosition({ x: e.pageX, y: e.pageY });
//   };

//   useEffect(() => {
//     document.addEventListener("mousemove", onMouseMove);

//     return () => {
//       document.removeEventListener("mousemove", onMouseMove);
//     };
//   }, []);

//   return (
//     <div
//       className="cursor"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//       }}
//     />
//   );
// };

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    setPosition({ x: e.pageX, y: e.pageY });
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      className="cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};

export default Cursor;
