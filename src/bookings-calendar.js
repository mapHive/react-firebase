import React from "react";
import classnames from "classnames/bind";
import {
  format,
  startOfDay,
  addMinutes,
  addDays,
  isSameDay,
  isSameMonth,
  isSameYear,
  isWithinInterval,
} from "date-fns";
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

const generateDatesAndTimeSlots = (
  fromDate,
  numDays,
  minutesPerTimeslot,
  minTime,
  maxTime
) => {
  const today = new Date();

  // Generate an array of dates that we want to render
  const dateRange = Array.from({ length: numDays }, (val, index) =>
    addDays(fromDate, index)
  );

  return dateRange.map((date) => ({
    date,
    isToday: isSameDay(today, date),
    timeslots: generateTimeslotsForDate(
      date,
      minutesPerTimeslot,
      minTime,
      maxTime
    ),
  }));
};

const MINUTES_IN_DAY = 24 * 60;

const generateTimeslotsForDate = (
  date,
  minutesPerTimeslot,
  minTime,
  maxTime
) => {
  const dayStart = startOfDay(date);
  const now = new Date();
  const numTimeslots = Math.floor(MINUTES_IN_DAY / minutesPerTimeslot);

  // Replace this is for loop if easier to understand
  // use datefns to figure out max and min timeslots as boundaries, generate between
  return Array.from({ length: numTimeslots }, (val, index) => {
    const start = addMinutes(dayStart, index * minutesPerTimeslot);
    const end = addMinutes(start, minutesPerTimeslot);
    const isCurrent = isWithinInterval(now, { start, end });

    return { start, end, isCurrent };
  });
};

const getTimespanTitle = (startDate, endDate) => {
  if (isSameMonth(startDate, endDate)) {
    return format(startDate, "MMMM yyyy");
  }

  if (isSameYear(startDate, endDate)) {
    return `${format(startDate, "MMMM")} - ${format(endDate, "MMMM")} ${format(
      startDate,
      "yyyy"
    )}`;
  }

  return `${format(startDate, "MMMM yyyy")} - ${format(endDate, "MMMM yyyy")}`;
};
