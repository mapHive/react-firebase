import React, { useMemo, memo } from "react";
import { format, startOfDay } from "date-fns";
import classnames from "classnames/bind";

import { BOOKINGS_CALENDAR_DAYS } from "../constants";
import { generateDatesAndTimeSlots, getTimespanTitle } from "./lib";
import styles from "./bookings-calendar.module.css";
import useBookingConfig from "./use-booking-config";
import useBookings from "./use-bookings";

const cx = classnames.bind(styles);

const BookingsCalendar = () => {
  const bookingConfig = useBookingConfig();
  const bookings = useBookings();

  const config = bookingConfig.config || {};

  const datesToRender = useMemo(() => {
    if (!config) return [];

    const now = new Date();

    return generateDatesAndTimeSlots({
      fromDate: startOfDay(now),
      currentDate: now,
      numDays: BOOKINGS_CALENDAR_DAYS,
      minutesPerTimeslot: config.timeslotDurationMinutes,
      minTime: config.dayStartTime,
      maxTime: config.dayEndTime,
      currentBookings: bookings,
    });
  }, [config, bookings]);

  return (
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
              {timeslots.map(({ start, end, isCurrent }) => (
                <div
                  className={cx({
                    date__timeslot: true,
                    "date__timeslot--current": isCurrent,
                  })}
                  key={start.toString()}
                >
                  {format(start, "p")}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(BookingsCalendar);
