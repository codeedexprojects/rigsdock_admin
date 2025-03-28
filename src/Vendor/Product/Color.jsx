import React, { useState } from "react";
import { SketchPicker } from "react-color";
import namer from "color-namer";

const ColorPickerComponent = () => {
  const [color, setColor] = useState({
    hex: "#ffffff",
    name: "White",
  });

  const handleChangeComplete = (color) => {
    const colorName = namer(color.hex).ntc[0].name; // Get closest name
    setColor({
      hex: color.hex,
      name: colorName,
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <SketchPicker color={color.hex} onChangeComplete={handleChangeComplete} />
      <h3>Selected Color:</h3>
      <div
        style={{
          backgroundColor: color.hex,
          width: "100px",
          height: "50px",
          margin: "10px auto",
          border: "1px solid #000",
        }}
      ></div>
      <p>
        <strong>Hex Code:</strong> {color.hex}
      </p>
      <p>
        <strong>Color Name:</strong> {color.name}
      </p>
    </div>
  );
};

export default ColorPickerComponent;
