import { useContext, useCallback, useMemo, useEffect, useState } from "react";

import app from "../base";
import { AuthContext } from "../auth";
import { dateToStoredDate, storedDateToDate } from "./lib";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }

const useBookings = () => {
  const { currentUser } = useContext(AuthContext);
  const [submissionError, setSubmissionError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState();

  const userId = currentUser?.uid;

  const dataRef = useMemo(() => app.database().ref("Bookings"), []);

  const submitBooking = useCallback(
    (start, end) => {
      if (!userId) return;

      const bookingInfo = {
        userId,
        // toISOString stores in UTC and should be correctable when parsing for local timezone
        start: dateToStoredDate(start),
        end: dateToStoredDate(end),
      };

      setSubmissionError(null);
      setLoading(true);

      dataRef
        .push(bookingInfo)
        .catch(setSubmissionError)
        .finally(() => setLoading(false));
    },
    [userId, dataRef]
  );

  useEffect(() => {
    if (!userId) return;

    const handleValue = (snapshot) => {
      setBookings(
        Object.entries(snapshot.val()).reduce((acc, [id, booking]) => {
          acc[id] = {
            start: storedDateToDate(booking.start),
            end: storedDateToDate(booking.end),
            isUserBooking: userId === booking.userId,
          };
          return acc;
        }, {})
      );
      setLoading(false);
    };

    dataRef.on("value", handleValue);

    return () => {
      dataRef.off("value", handleValue);
    };
  }, [dataRef, userId]);

  return { bookings, submitBooking, submissionError, loading };
};

export default useBookings;
