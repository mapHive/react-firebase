import React, { useMemo, memo } from "react";
import { format, set, startOfDay } from "date-fns";
import classnames from "classnames/bind";

import { BOOKINGS_CALENDAR_DAYS } from "../constants";
import useBookingConfig from "../use-booking-config";
import useBookings from "../use-bookings";
import { generateDatesAndTimeSlots, getTimespanTitle } from "./lib";
import Timeslot from "./timeslot";
import styles from "./bookings-calendar.module.css";

const cx = classnames.bind(styles);

const BookingsCalendar = () => {
  const now = new Date();
  const bookingConfig = useBookingConfig();
  const bookings = useBookings({ from: now, numDays: BOOKINGS_CALENDAR_DAYS });

  const config = bookingConfig.config;

  const datesToRender = useMemo(() => {
    if (!config) return null;

    return generateDatesAndTimeSlots({
      fromDate: startOfDay(now),
      currentDate: set(now, { date: 8, hours: 8, minutes: 30 }),
      numDays: BOOKINGS_CALENDAR_DAYS,
      minutesPerTimeslot: config.timeslotDurationMinutes,
      minTime: config.dayStartTime,
      maxTime: config.dayEndTime,
      bookings: bookings.bookings || [],
    });
  }, [now, config, bookings]);

  return datesToRender ? (
    <div>
      <h2 className={styles.title}>
        {getTimespanTitle(
          datesToRender[0].date,
          datesToRender[datesToRender.length - 1].date
        )}
      </h2>
      <div className={styles.container}>
        {datesToRender.map(({ date, isToday, timeslots }) => (
          <div
            className={cx({ date: true, "date--today": isToday })}
            key={date.toString()}
          >
            <div className={styles.date__title}>
              <div className={styles.date__title__day}>
                {format(date, "eee")}
              </div>
              <div className={styles.date__title__date}>
                {format(date, "d")}
              </div>
            </div>
            <div>
              {timeslots.map((timeslot) => (
                <Timeslot {...timeslot} key={timeslot.start.toString()} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    "Preparing calendar..."
  );
};

export default memo(BookingsCalendar);
