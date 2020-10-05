import {
  format,
  startOfDay,
  addMinutes,
  addDays,
  isSameDay,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  parseISO,
} from "date-fns";

const MINUTES_IN_DAY = 24 * 60;

export const dateToStoredDate = (date) => date.toISOString();

export const storedDateToDate = (isoString) => parseISO(isoString);

const generateTimeslotsForDate = ({
  date,
  minutesPerTimeslot,
  minTime,
  maxTime,
  currentDate,
}) => {
  const dayStart = startOfDay(date);
  const now = currentDate || new Date();
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

export const generateDatesAndTimeSlots = ({
  fromDate,
  numDays,
  minutesPerTimeslot,
  minTime,
  maxTime,
  currentDate,
}) => {
  const now = currentDate || Date.now();

  // Generate an array of dates that we want to render
  return Array.from({ length: numDays }, (val, index) => {
    const date = addDays(fromDate, index);

    return {
      date,
      isToday: isSameDay(now, date),
      timeslots: generateTimeslotsForDate({
        date,
        minutesPerTimeslot,
        minTime,
        maxTime,
        currentDate: now,
      }),
    };
  });
};

export const getTimespanTitle = (startDate, endDate) => {
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
