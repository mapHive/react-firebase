import { useContext, useCallback, useMemo, useEffect, useState } from "react";
import { addDays, endOfDay, startOfDay } from "date-fns";

import app from "../base";
import { AuthContext } from "../auth";
import { dateToStoredDate, parseBookingData } from "./bookings-calendar/lib";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }

const useBookings = ({ from, numDays }) => {
  const { currentUser } = useContext(AuthContext);
  const [apiError, setApiError] = useState(null);
  const [apiStatus, setApiStatus] = useState("reading");
  const [bookings, setBookings] = useState();

  const userId = currentUser?.uid;

  const dataRef = useMemo(() => app.database().ref("Bookings"), []);

  const timeboxedDataRef = useMemo(() => {
    const startDateTime = startOfDay(from);
    const endDateTime = endOfDay(addDays(startDateTime, numDays));

    return dataRef
      .orderByChild("start")
      .startAt(dateToStoredDate(startDateTime))
      .endAt(dateToStoredDate(endDateTime));
  }, [dataRef, from, numDays]);

  const submitBooking = useCallback(
    (start, end) => {
      if (!userId) return;

      const bookingInfo = {
        userId,
        // toISOString stores in UTC and should be correctable when parsing for local timezone
        start: dateToStoredDate(start),
        end: dateToStoredDate(end),
      };

      setApiError(null);
      setApiStatus("submitting");

      dataRef.push(bookingInfo).catch((err) => {
        setApiError(new Error(`SUBMIT_BOOKING: ${err.message}`));
      });
    },
    [userId, dataRef]
  );

  const removeBooking = useCallback(
    (bookingId) => {
      setApiError(null);
      setApiStatus("removing");

      dataRef
        .child(bookingId)
        .remove()
        .catch((err) => {
          setApiError(new Error(`REMOVE_BOOKING: ${err.message}`));
        });
    },
    [dataRef]
  );

  useEffect(() => {
    if (!userId) return;

    const handleValue = (snapshot) => {
      setBookings(parseBookingData(snapshot.val() || {}, { userId }));
      setApiStatus("idle");
    };

    timeboxedDataRef.on("value", handleValue);

    return () => {
      timeboxedDataRef.off("value", handleValue);
    };
  }, [userId, timeboxedDataRef]);

  return {
    bookings,
    submitBooking,
    removeBooking,
    apiError,
    apiStatus,
  };
};

export default useBookings;
