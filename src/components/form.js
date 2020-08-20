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
      <form>
        <div>
          <label>Question 1</label>
          <input
            type="email"
            name="email"
            id="InputEmail1"
            placeholder="Enter answer 1"
            required="required"
          />
        </div>
        <div>
          <label>Question 2</label>
          <input
            type="text"
            name="name"
            id="leInputName"
            placeholder="Enter answer 2"
            required="required"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
