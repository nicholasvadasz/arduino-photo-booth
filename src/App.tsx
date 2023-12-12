import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import ShaderImage from "./ShaderImage";

function App() {
  const [variables, setVariables] = useState([0, 0]);
  const [version, setVersion] = useState("grayscale");

  const mapper = (value: number) => {
    switch (value) {
      case 0:
        return "grayscale";
      case 1:
        return "swirl";
      case 2:
        return "mirror";
      default:
        return "swirl";
    }
  }

  useEffect(() => {
    fetch("/variables.txt")
      .then((response) => response.text())
      .then((text) => {
        const variables = text.split(" ");
        setVersion(mapper(variables[0].trim() as unknown as number));
        setVariables([variables[1].trim() as unknown as number, variables[2].trim() as unknown as number]);
      });
  }, []);

  return (
    <div className="App">
      <h1 style={{ fontFamily: "Comic Sans MS" }}>Arduino Photobooth!</h1>
      <div className="outerBevel">
        <div className="flatSurface">
          <div className="innerBevel" style={{ height: "45vh", width: "38vw" }}>
            <ShaderImage imagePath="/image.jpg" version={version} variables={variables}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
