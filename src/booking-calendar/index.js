import React, { memo } from "react";
import { format } from "date-fns";
import classnames from "classnames/bind";

import {
  BOOKING_CALENDAR_DAYS,
  BOOKING_MINUTES_PER_TIMESLOT,
  BOOKING_CALENDAR_DAY_CLOSING_TIME,
  BOOKING_CALENDAR_DAY_OPENING_TIME,
} from "../constants";
import { generateDatesAndTimeSlots, getTimespanTitle } from "./lib";
import styles from "./booking-calendar.module.css";

const cx = classnames.bind(styles);

const BookingCalendar = ({
  fromDate = new Date(),
  numDays = BOOKING_CALENDAR_DAYS,
  minTime = BOOKING_CALENDAR_DAY_OPENING_TIME,
  maxTime = BOOKING_CALENDAR_DAY_CLOSING_TIME,
  minutesPerTimeslot = BOOKING_MINUTES_PER_TIMESLOT,
}) => {
  const datesToRender = generateDatesAndTimeSlots(
    fromDate,
    numDays,
    minutesPerTimeslot,
    minTime,
    maxTime
  );

  /*
  [
    { date: Date, isToday: (t|f), timeslots: [{ start, isCurrent: (t|f), end }, ...] },
    ...
  ]
*/

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

export default memo(BookingCalendar);
