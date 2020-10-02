import React, { useContext, useState, useEffect } from "react";

import firebase from "./base";
import { AuthContext } from "./auth";

const CovidCheckEntries = () => {
  const { currentUser } = useContext(AuthContext);
  const email = currentUser?.email;
  const userId = currentUser?.uid;

  const [entries, setEntries] = useState({});

  useEffect(() => {
    if (!userId) return;

    const dataRef = firebase
      .database()
      .ref("UserData")
      .child(userId)
      .child("Submission");

    const handleValue = (snapshot) => {
      setEntries(snapshot.val());
    };

    dataRef.on("value", handleValue);

    return () => {
      dataRef.off("value", handleValue);
    };
  }, [userId]);

  return (
    <div>
      <h1>Hi {email}, here are your Entries</h1>
      <ul>
        {Object.entries(entries).map(([id, { values }]) => (
          <li key={id}>
            {Object.entries(values).map(([question, answer]) => (
              <div key={question}>
                <div>{question}:</div>
                <div>{answer}</div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CovidCheckEntries;
