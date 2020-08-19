import React, { useState } from "react";
import firebase from "../base";

const Form = () => {
  const [input, setInput] = useState("");

  const handleOnChange = (e) => {
    setInput(e.target.value);
  };

  const pushData = () => {
    const dataRef = firebase.database().ref("Data");
    const data = {
      input,
    };

    dataRef.push(data);
  };

  return (
    <div>
      <input type="text" onChange={handleOnChange} value={input} />
      <button onClick={pushData}>Add Data</button>
    </div>
  );
};

export default Form;
