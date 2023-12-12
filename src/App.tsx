import React from "react";
import "./App.css";
import { useState, useEffect, useRef } from "react";

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
      case 4:
        return "invert";
      case 5:
        return "no filter";
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
            version === 'invert' ? 'invert(100%) brightness(' + variables[0] / 500 + ') saturate(' + variables[1] / 500 + ')' :
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

  const refreshPage = () => {
      window.location.reload();
  } 

  const imageRef = useRef();

  const saveImageWithFilters = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = imageRef.current as unknown as HTMLImageElement;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx!.filter = image.style.filter;
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = "filtered-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="App">
      <h1 style={{ fontFamily: "Comic Sans MS" }}>ARDUINO PHOTOBOOTH</h1>
      <div className="outerBevel">
        <div className="flatSurface">
          <div className="innerBevel" style={{ height: "53.5vh", width: "50vw" }}>
          <img src={imagePath} alt="Photobooth" style={imageStyle} ref={imageRef as any} />
          </div>
        </div>
      </div>
      <div className="rowOfThings" style={{ fontFamily: "Comic Sans MS" }}>
          <button onClick={saveImageWithFilters} className="retrieveButton">Save Image</button>
          <h3>Current Filter: {version}</h3>
          <h3>Brightness: {variables[0] / 500}</h3>
          <h3>Saturation: {variables[1] / 500}</h3>
          <button onClick={refreshPage} className="retrieveButton">Retrieve Image</button>
      </div>
    </div>
  );
}

export default App;