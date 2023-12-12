import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import ShaderImage from "./ShaderImage";

function App() {
  const [variables, setVariables] = useState([0, 0]);
  const [version, setVersion] = useState("grayscale");

  useEffect(() => {
    fetch("/variables.txt")
      .then((response) => response.text())
      .then((text) => {
        const variables = text.split(" ");
        setVariables([variables[0] as unknown as number, variables[1] as unknown as number]);
        setVersion(variables[2].trim());
      });
  }, []);

  return (
    <div className="App">
      <h1 style={{ fontFamily: "Comic Sans MS" }}>Arduino Photobooth!</h1>
      <div className="outerBevel">
        <div className="flatSurface">
          <div className="innerBevel" style={{ height: "45vh", width: "36vw" }}>
            <ShaderImage imagePath="/image.jpg" version={version} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
