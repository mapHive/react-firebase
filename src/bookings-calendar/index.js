import React from "react";
import classnames from "classnames/bind";
import { format } from "date-fns";

import { generateDatesAndTimeSlots, getTimespanTitle } from "./lib";
import styles from "./bookings-calendar.module.css";

const cx = classnames.bind(styles);

const BookingsCalendar = ({
  fromDate = new Date(),
  numDays = 7,
  minutesPerTimeslot = 60,
  minTime = "0500",
  maxTime = "2100",
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

export default BookingsCalendar;
