import { useContext, useCallback, useMemo, useEffect, useState } from "react";
import { addDays, endOfDay, startOfDay } from "date-fns";

import app from "../base";
import { AuthContext } from "../auth";
import { dateToStoredDate, parseBookingData } from "./bookings-calendar/lib";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }

const useBookings = ({ from, numDays }) => {
  const { currentUser } = useContext(AuthContext);
  const [submissionError, setSubmissionError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState();

  const userId = currentUser?.uid;

  const dataRef = useMemo(() => {
    const startDateTime = startOfDay(from);
    const endDateTime = endOfDay(addDays(startDateTime, numDays));

    return app
      .database()
      .ref("Bookings")
      .orderByChild("start")
      .startAt(dateToStoredDate(startDateTime))
      .endAt(dateToStoredDate(endDateTime));
  }, [from, numDays]);

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
      setBookings(parseBookingData(snapshot.val() || {}, { userId }));
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
