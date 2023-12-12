import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [variables, setVariables] = useState([0, 0]);
  const [version, setVersion] = useState("grayscale");
  const [imagePath, setImagePath] = useState("/image.jpg");
  
  const mapper = (value: number) => {
    switch (value) {
      case 1:
        return "grayscale";
      case 2:
        return "sepia";
      case 3:
        return "blur";
      default:
        return "no filter";
    }
  }

  useEffect(() => {
    const interval = setInterval(readFile, 500); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, []);

  const imageStyle = {
    width: "100%",
    height: "100%",
    filter: version === 'grayscale' ? 'grayscale(100%) brightness(' + variables[0] / 500 + ') saturate(' + variables[1] / 500 + ')' :
            version === 'sepia' ? 'sepia(100%) brightness(' + variables[0] / 500 + ') saturate(' + variables[1] / 500 + ')' :
            version === 'blur' ? 'blur(5px) brightness(' + variables[0] / 500 + ') saturate(' + variables[1] / 500 + ')' : 'brightness(' + variables[0] / 500 + ') saturate(' + variables[1] / 500 + ')'
  };

  const readFile = () => {
    fetch("/variables.txt")
      .then((response) => response.text())
      .then((text) => {
        const variables = text.split(" ");
        setVersion(mapper(parseInt(variables[0].trim())));

        setVariables([variables[1].trim() as unknown as number, variables[2].trim() as unknown as number]);
        if (variables[4].trim() === "1") {
          setImagePath("/cat.jpg");
        } else {
          setImagePath("/image.jpg");
        }
      });
    };

  return (
    <div className="App">
      <h1 style={{ fontFamily: "Comic Sans MS" }}>ARDUINO PHOTOBOOTH</h1>
      <div className="outerBevel">
        <div className="flatSurface">
          <div className="innerBevel" style={{ height: "59.5vh", width: "50vw" }}>
          <img src={imagePath} alt="Photobooth" style={imageStyle} />
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