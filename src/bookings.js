import "date-fns";
import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { addMinutes } from "date-fns";

import firebase from "./base";
import { AuthContext } from "./auth";
import { BOOKING_MINUTES_PER_TIMESLOT } from "./constants";
import BookingCalendar from "./booking-calendar/index";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }

function Booking() {
  const { currentUser } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [submissionError, setSubmissionError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [currentBookings, setCurrentBookings] = React.useState({});
  const userId = currentUser?.uid;

  const handleDateChange = React.useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      const bookingsRef = firebase.database().ref("Bookings");
      const bookingInfo = {
        userId,
        // toISOString stores in UTC and should be correctable when parsing for local timezone
        start: selectedDate.toISOString(),
        end: addMinutes(
          selectedDate,
          BOOKING_MINUTES_PER_TIMESLOT
        ).toISOString(),
      };

      setSubmissionError(null);
      setLoading(true);

      bookingsRef
        .push(bookingInfo)
        .catch(setSubmissionError)
        .finally(() => setLoading(false));
    },
    [selectedDate, userId]
  );

  React.useEffect(() => {
    const dataRef = firebase.database().ref("Bookings");

    const handleValue = (snapshot) => {
      setCurrentBookings(snapshot.val());
    };

    dataRef.on("value", handleValue);

    return () => {
      dataRef.off("value", handleValue);
    };
  }, []);

  return (
    <>
      <h2>Create Booking</h2>
      {loading ? (
        "Loading..."
      ) : (
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
      )}
      {submissionError ? <div>Could not save booking</div> : null}
      <h2>Current Bookings</h2>
      <ul>
        {Object.entries(currentBookings).map(([id, booking]) =>
          booking.userId === userId ? (
            <div key={id}>
              {booking.start} - {booking.end}
            </div>
          ) : null
        )}
      </ul>
      <BookingCalendar />
    </>
  );
}

export default Booking;
