import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [variables, setVariables] = useState([0, 0]);

  
  useEffect(() => {
  fetch('/variables.txt')
    .then(response => response.text())
    .then(text => {
      const variables = text.split(",");
      setVariables(variables as any);
  });
  }
  , []);


  return (
    <div className="App">
      <h1 style={{fontFamily: "Comic Sans MS"}}>Arduino Photobooth!</h1>
      <div className="img-container">
      <img src="/image.jpg" alt="logo" style={{filter: `contrast(${variables[0]}%) hue-rotate(${variables[1]}deg)`}}  /> 
      </div>
    </div>
  );
}

export default App;
