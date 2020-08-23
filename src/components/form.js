import React, { useState, useContext } from "react";
import firebase from "../base";
import { AuthContext } from "../auth";

const validate = (values) => {
  let errors = {};

  if (!values.q1) {
    errors.q1 = "This field needs to be filled";
  }
  if (!values.q2) {
    errors.q2 = "This field needs to be filled";
  }

  return errors;
};

const hasErrors = (errors) => {
  const errorValues = Object.values(errors);
  const isError = (str) => !!str;

  return errorValues.some(isError);
};

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

    if (hasErrors(submissionErrors)) {
      // Set the errors on state so that ui updates, don't run the
      // form submission
      setErrors(submissionErrors);
      return;
    }

    setErrors({});

    const dataRef = firebase.database().ref("Submission");

    dataRef.push(values);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
