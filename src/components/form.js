import React, { useState } from "react";
import firebase from "../base";

const Form = () => {
  const initialFieldValues = {
    q1: "",
    q2: "",
  };

  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState(initialFieldValues);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(values));

    const dataRef = firebase.database().ref("Submission");
    // const data = { values }; Not needed but kept for reference

    dataRef.push(values);
  };

  function validate(values) {
    let errors = {};
    if (!values.q1) {
      errors.q1 = "This field needs to be filled";
    }
    if (!values.q2) {
      errors.q2 = "This field needs to be filled";
    }

    return errors;
  }

  return (
    <form>
      <div>
        <label>Question 1</label>
        <input
          type="text"
          name="q1"
          id="q1"
          placeholder="Enter answer 1"
          value={values.q1}
          onChange={handleOnChange}
        />
        {errors.q1 && <p>{errors.q1}</p>}
      </div>
      <div>
        <label>Question 2</label>
        <input
          type="text"
          name="q2"
          id="q2"
          placeholder="Enter answer 2"
          value={values.q2}
          onChange={handleOnChange}
        />
        {errors.q2 && <p>{errors.q2}</p>}
      </div>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default Form;
