import React, { useState, useContext } from "react";
import firebase from "../base";
import { AuthContext } from "../auth";

const Form = () => {
  const initialFieldValues = {
    q1: "",
    q2: "",
  };

  const currentUser = useContext(AuthContext);
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

    // First we get the validation errors without setting state
    // We were setting the error state immediately, then checking if there
    // were errors on the state, which does not work
    const submissionErrors = validate(values);
    // Figure out if there are errors
    const errorValues = Object.values(submissionErrors);
    const isError = (str) => !!str;
    const hasErrors = errorValues.some(isError);

    if (hasErrors) {
      // Set the errors on state so that ui updates, don't run the
      // form submission
      setErrors(submissionErrors);
      return;
    }

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
      <h1>Hello {currentUser.currentUser.email}</h1>
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
