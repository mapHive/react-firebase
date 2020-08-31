import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import firebase from "./base";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function MaterialUIPickers() {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2020T12:00:00")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingRef = firebase.database().ref("Booking");
    const bookingFormat = format(selectedDate, "'Today is a' iiii");
    const booking = bookingFormat;

    bookingRef.push(booking);
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
