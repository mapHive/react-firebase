import { Temporal } from "proposal-temporal";

import { compareDateTimes, formatTemporal } from "../lib/date-time";

export const dateTimeToStoredDate = (
  dateTime // Temporal.DateTime
) => formatTemporal(dateTime, "yyyy-MM-dd'T'HH:mm");

export const storedDateToDateTime = (
  storedDate // string
) => Temporal.DateTime.from(storedDate);

const generateTimeslotsForDate = (
  date, // Temporal.Date
  currentDateTime, // Temporal.DateTime
  {
    minTime, // Temporal.Time
    maxTime, // Temporal.Time
    minutesPerTimeslot, // number
    maxBookingsPerTimeslot, // number
    bookings, // BookingType[]
  }
) => {
  const numTimeslots = Math.floor(
    maxTime.difference(minTime, { largestUnit: "minutes" }).minutes /
      minutesPerTimeslot
  );
  const dayStart = Temporal.DateTime.from(date).with(minTime);

  return Array.from({ length: numTimeslots }, (val, index) => {
    const start = dayStart.plus({ minutes: index * minutesPerTimeslot });
    const end = start.plus({ minutes: minutesPerTimeslot });
    const isCurrent =
      compareDateTimes(currentDateTime, start) >= 0 &&
      compareDateTimes(currentDateTime, end) <= 0;
    const isPast = compareDateTimes(currentDateTime, end) > 0;
    const timeslotBookings =
      bookings?.filter(
        (booking) =>
          compareDateTimes(start, booking.start) === 0 &&
          compareDateTimes(end, booking.end) === 0
      ) ?? [];

    return {
      start,
      end,
      isCurrent,
      isPast,
      isFull: timeslotBookings.length >= maxBookingsPerTimeslot,
      userBookingId: timeslotBookings.find(({ isUserBooking }) => isUserBooking)
        ?.id,
    };
  });
};

export const generateCalendarData = ({
  numDays, // number
  currentDateTime, // Temporal.DateTime
  minTime, // Temporal.Time
  maxTime, // Temporal.Time
  minutesPerTimeslot, // number
  maxBookingsPerTimeslot, // number
  bookings, // BookingType[]
}) => {
  const fromDate = Temporal.Date.from(currentDateTime);

  // Generate an array of dates that we want to render
  return Array.from({ length: numDays }, (val, index) => {
    const date = fromDate.plus({ days: index });

    return {
      date,
      isToday: index === 0,
      timeslots: generateTimeslotsForDate(date, currentDateTime, {
        minTime,
        maxTime,
        minutesPerTimeslot,
        maxBookingsPerTimeslot,
        bookings,
      }),
    };
  });
};

export const getTimespanTitle = (
  startDate, // Temporal.Date
  endDate // Temporal.Date
) => {
  if (endDate.difference(startDate, { largestUnit: "months" }).months === 0) {
    return formatTemporal(startDate, "MMMM yyyy");
  }

  if (startDate.difference(endDate, { largestUnit: "years" }).years === 0) {
    return `${formatTemporal(startDate, "MMMM")} - ${formatTemporal(
      endDate,
      "MMMM"
    )} ${formatTemporal(startDate, "yyyy")}`;
  }

  return `${formatTemporal(startDate, "MMMM yyyy")} - ${formatTemporal(
    endDate,
    "MMMM yyyy"
  )}`;
};

export const parseBookingData = (data, { userId }) =>
  Object.entries(data).reduce((acc, [id, booking]) => {
    acc.push({
      id,
      start: storedDateToDateTime(booking.start),
      end: storedDateToDateTime(booking.end),
      isUserBooking: userId === booking.userId,
    });

    return acc;
  }, []);
