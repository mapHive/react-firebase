import React, { useMemo, memo, useCallback } from "react";
import { Temporal } from "proposal-temporal";
import classnames from "classnames/bind";

import {
  formatTemporal,
  getCurrentDateTimeInTimezone,
} from "../../lib/date-time";
import { BOOKINGS_CALENDAR_DAYS } from "../constants";
import useBookingConfig from "../use-booking-config";
import useBookings from "../use-bookings";
import { generateCalendarData, getTimespanTitle } from "../lib";
import Timeslot from "./timeslot";
import styles from "./bookings-calendar.module.css";

const cx = classnames.bind(styles);

const BookingsCalendar = () => {
  const { config } = useBookingConfig();
  const { timezone } = config || {};

  const now = useMemo(
    () => getCurrentDateTimeInTimezone(timezone || "Australia/Melbourne"),
    [timezone]
  );

  const {
    bookings,
    submitBooking,
    removeBooking,
    apiStatus,
    apiError,
  } = useBookings({
    fromDateTime: now,
    numDays: BOOKINGS_CALENDAR_DAYS,
  });

  const datesToRender = useMemo(() => {
    if (!config) return null;

    return generateCalendarData({
      currentDateTime: now,
      numDays: BOOKINGS_CALENDAR_DAYS,
      maxBookingsPerTimeslot: config.maxBookingsPerTimeslot,
      minutesPerTimeslot: config.timeslotDurationMinutes,
      minTime: Temporal.Time.from(config.dayStartTime),
      maxTime: Temporal.Time.from(config.dayEndTime),
      bookings: bookings || [],
    });
  }, [now, config, bookings]);

  const handleTimeslotClick = useCallback(
    (timeslot) => {
      if (timeslot.userBookingId) {
        // eslint-disable-next-line
        const confirmation = confirm(
          `Remove your ${formatTemporal(timeslot.start, "p")} booking?`
        );

        if (confirmation) removeBooking(timeslot.userBookingId);

        return;
      }

      if (timeslot.isPast) return;

      if (timeslot.isFull) {
        alert("Sorry, this timeslot is fully booked");

        return;
      }

      // eslint-disable-next-line
      const confirmation = confirm(
        `Book gym for ${formatTemporal(
          timeslot.start,
          "p"
        )} to ${formatTemporal(timeslot.end, "p")}?`
      );

      if (confirmation) submitBooking(timeslot.start, timeslot.end);
    },
    [submitBooking, removeBooking]
  );

  return (
    <>
      {apiStatus === "idle" ? null : (
        <div className={cx({ infobox: true, status: true })}>Updating...</div>
      )}
      {apiError ? (
        <div className={cx({ infobox: true, error: true })}>
          {getErrorMessage(apiError)}
        </div>
      ) : null}
      {datesToRender ? (
        <div>
          <h2 className={styles.title}>
            {getTimespanTitle(
              datesToRender[0].date,
              datesToRender[datesToRender.length - 1].date
            )}
          </h2>
          <div className={styles.container}>
            <div className={styles.body}>
              {datesToRender.map(({ date, isToday, timeslots }) => (
                <div
                  className={cx({ date: true, "date--today": isToday })}
                  key={date.toString()}
                >
                  <div className={styles.date__title}>
                    <div className={styles.date__title__day}>
                      {formatTemporal(date, "eee")}
                    </div>
                    <div className={styles.date__title__date}>
                      {formatTemporal(date, "d")}
                    </div>
                  </div>
                  <div>
                    {timeslots.map((timeslot) => (
                      <Timeslot
                        timeslot={timeslot}
                        onClick={handleTimeslotClick}
                        key={timeslot.start.toString()}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default memo(BookingsCalendar);

const getErrorMessage = (apiError) => {
  if (apiError.message.startsWith("REMOVE_BOOKING")) {
    return "Sorry, we could not remove your booking at this time.";
  }

  if (apiError.message.startsWith("SUBMIT_BOOKING")) {
    return "Sorry, we could not add your booking at this time.";
  }

  return "Sorry, something went wrong.";
};
