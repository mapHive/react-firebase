import "date-fns";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { AuthContext } from "./auth";
import firebase from "./base";
import { format } from "date-fns";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

function Booking() {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingRef = firebase.database().ref("Booking");
    // const bookingISO = selectedDate.toISOString(); This outputs an incorrect time for some reason.
    const booking = selectedDate.toString();
    const bookingInfo = {
      booking,
      user: { email: currentUser.email, uid: currentUser.uid },
    };

    bookingRef.push(bookingInfo);

    alert("Thank you");
    history.push("/");
  };

  return (
    <>
      <div>{format(selectedDate, "'Today is a' iiii")}</div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Select a date"
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardTimePicker
            minutesStep={15}
            margin="normal"
            id="time-picker"
            label="Select a time"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
          />
        </Grid>
        <button type="submit" onClick={handleSubmit}>
          Book Gym
        </button>
      </MuiPickersUtilsProvider>
    </>
  );
}

export default Booking;
