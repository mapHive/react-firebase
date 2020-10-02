import "date-fns";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format, addMinutes } from "date-fns";

import firebase from "./base";
import { AuthContext } from "./auth";
import { BOOKING_MINUTES_PER_TIMESLOT } from "./constants";
import BookingCalendar from "./booking-calendar/index";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }

function Booking() {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const userId = currentUser?.uid;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingsRef = firebase.database().ref("Bookings");
    const bookingInfo = {
      // toISOString stores in UTC and should be correctable when parsing for local timezone
      start: selectedDate.toISOString(),
      end: addMinutes(selectedDate, BOOKING_MINUTES_PER_TIMESLOT).toISOString(),
      userId,
    };

    bookingsRef.push(bookingInfo);

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
      <BookingCalendar />
    </>
  );
}

export default Booking;
