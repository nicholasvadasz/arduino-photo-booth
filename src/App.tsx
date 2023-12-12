import React from "react";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import ShaderImage from "./ShaderImage";

function App() {
  const [variables, setVariables] = useState([0, 0]);
  const [version, setVersion] = useState("grayscale");
  const [imagePath, setImagePath] = useState("/image.jpg");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mapper = (value: number) => {
    switch (value) {
      case 0:
        return "grayscale";
      case 1:
        return "swirl";
      case 2:
        return "mirror";
      default:
        return "no filter";
    }
  }

  useEffect(() => {
    fetch("/variables.txt")
      .then((response) => response.text())
      .then((text) => {
        const variables = text.split(" ");
        setVersion(mapper(variables[0].trim() as unknown as number));
        setVariables([variables[1].trim() as unknown as number, variables[2].trim() as unknown as number]);
        if (variables[3] && variables[3].trim() === "0") {
          setImagePath("/cat.jpg");
        } else {
          setImagePath("/image.jpg");
        }
      });
  }, []);

  return (
    <div className="App">
      <h1 style={{ fontFamily: "Comic Sans MS" }}>ARDUINO PHOTOBOOTH</h1>
      <div className="outerBevel">
        <div className="flatSurface">
          <div className="innerBevel" style={{ height: "59.5vh", width: "50vw" }}>
            <ShaderImage imagePath={imagePath} version={version} variables={variables} canvasRef={canvasRef} />
          </div>
        </div>
      </div>
      <div className="rowOfThings" style={{ fontFamily: "Comic Sans MS" }}>
          <h3>Current Filter: {version}</h3>
          <h3>Brightness: {variables[0] / 500}</h3>
          <h3>Saturation: {variables[1] / 500}</h3>
      </div>
    </div>
  );
}

export default App;
