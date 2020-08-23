import React, { useContext, useState, useEffect } from "react";

import firebase from "./base";
import { AuthContext } from "./auth";

const CovidCheckEntries = () => {
  const { currentUser } = useContext(AuthContext);

  const { email, uid } = currentUser;

  const [entries, setEntries] = useState({});

  useEffect(() => {
    const dataRef = firebase.database().ref("Submission");

    dataRef.on("value", (snapshot) => {
      setEntries(snapshot.val());
    });
  }, []);

  return (
    <div>
      <h1>Hi {email}, here are your Entries</h1>
      <ul>
        {Object.values(entries).map(({ user, values }) => (
          <li
            key={user.uid}
            style={user.uid !== uid ? { color: "red", fontWeight: "bold" } : {}}
          >
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
