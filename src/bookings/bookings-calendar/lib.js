import {
  format,
  set,
  startOfDay,
  addMinutes,
  addDays,
  isSameDay,
  isSameMonth,
  isSameMinute,
  isSameYear,
  isBefore,
  isWithinInterval,
  differenceInMinutes,
  parseISO,
} from "date-fns";

export const dateToStoredDate = (date) => date.toISOString();

export const storedDateToDate = (isoString) => parseISO(isoString);

const parseHoursMinutes = (hoursMinutesString) =>
  hoursMinutesString.split(":").map(Number);

const generateTimeslotsForDate = ({
  date,
  minutesPerTimeslot,
  maxBookingsPerTimeslot,
  minTime,
  maxTime,
  currentDate,
  bookings,
}) => {
  const [startHours, startMinutes] = parseHoursMinutes(minTime);
  const [endHours, endMinutes] = parseHoursMinutes(maxTime);
  const now = currentDate || new Date();
  const dayStart = set(startOfDay(date), {
    hours: startHours,
    minutes: startMinutes,
  });
  const dayEnd = set(startOfDay(date), {
    hours: endHours,
    minutes: endMinutes,
  });
  const numTimeslots = Math.floor(
    differenceInMinutes(dayEnd, dayStart) / minutesPerTimeslot
  );

  return Array.from({ length: numTimeslots }, (val, index) => {
    const start = addMinutes(dayStart, index * minutesPerTimeslot);
    const end = addMinutes(start, minutesPerTimeslot);
    const isCurrent = isWithinInterval(now, { start, end });
    const isPast = isBefore(end, now);
    const timeslotBookings =
      bookings?.filter(
        (booking) =>
          isSameMinute(start, booking.start) && isSameMinute(end, booking.end)
      ) ?? [];

    return {
      start,
      end,
      isCurrent,
      isPast,
      isFull: timeslotBookings.length >= maxBookingsPerTimeslot,
      userBooking: timeslotBookings.find((booking) => booking.isUserBooking),
    };
  });
};

export const generateCalendarData = ({
  fromDate,
  numDays,
  minutesPerTimeslot,
  maxBookingsPerTimeslot,
  minTime,
  maxTime,
  bookings,
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
        maxBookingsPerTimeslot,
        minTime,
        maxTime,
        bookings,
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

export const parseBookingData = (data, { userId }) =>
  Object.entries(data).reduce((acc, [id, booking]) => {
    acc.push({
      id,
      start: storedDateToDate(booking.start),
      end: storedDateToDate(booking.end),
      isUserBooking: userId === booking.userId,
    });

    return acc;
  }, []);
