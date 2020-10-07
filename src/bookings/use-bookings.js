import { useContext, useCallback, useMemo, useEffect, useState } from "react";

import app from "../base";
import { AuthContext } from "../auth";
import { dateTimeToStoredDate, parseBookingData } from "./lib";

// When storing date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) { user: …, date: date.toISOString() }

const useBookings = ({
  fromDateTime, // Temporal.DateTime
  numDays, // number
}) => {
  const { currentUser } = useContext(AuthContext);
  const [apiError, setApiError] = useState(null);
  const [apiStatus, setApiStatus] = useState("reading");
  const [bookings, setBookings] = useState();

  const userId = currentUser?.uid;

  const dataRef = useMemo(() => app.database().ref("Bookings"), []);

  const timeboxedDataRef = useMemo(
    () =>
      dataRef
        .orderByChild("start")
        .startAt(dateTimeToStoredDate(fromDateTime))
        .endAt(dateTimeToStoredDate(fromDateTime.plus({ days: numDays }))),
    [dataRef, fromDateTime, numDays]
  );

  const submitBooking = useCallback(
    (
      start, // DateTime
      end // DateTime
    ) => {
      if (!userId) return;

      const bookingInfo = {
        userId,
        start: dateTimeToStoredDate(start),
        end: dateTimeToStoredDate(end),
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
