import React, { useState } from "react";
import firebase from "../base";

// const Form = () => {
// const [input, setInput] = useState("");

// const handleOnChange = (e) => {
//   setInput(e.target.value);
// };

// const pushData = () => {
//   const dataRef = firebase.database().ref("Data");
//   const data = {
//     input,
//   };

//   dataRef.push(data);
// };

// return (
//   <div>
//     <input type="text" onChange={handleOnChange} value={input} />
//     <button onClick={pushData}>Add Data</button>
//   </div>
// );

const Form = () => {
  const initialFieldValues = {
    q1: "",
    q2: "",
  };

  const [values, setValues] = useState(initialFieldValues);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataRef = firebase.database().ref("Submission");
    // const data = { values }; Not needed but kept for reference

    dataRef.push(values);
  };

  return (
    <form>
      <div>
        <label>Question 1</label>
        <input
          type="text"
          name="q1"
          id="q1"
          placeholder="Enter answer 1"
          required="required"
          value={values.q1}
          onChange={handleOnChange}
        />
      </div>
      <div>
        <label>Question 2</label>
        <input
          type="text"
          name="q2"
          id="q2"
          placeholder="Enter answer 2"
          required="required"
          value={values.q2}
          onChange={handleOnChange}
        />
      </div>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default Form;
