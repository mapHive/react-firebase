import { Temporal } from "proposal-temporal";

import { getTimespanTitle, generateCalendarData } from "./lib";

describe("booking-calendar/lib", () => {
  describe("getTimespanTitle", () => {
    it("properly formats start and end date in same month", () => {
      const start = Temporal.Date.from("2020-10-05");
      const end = Temporal.Date.from("2020-10-10");

      expect(getTimespanTitle(start, end)).toBe("October 2020");
    });

    it("properly formats start and end date in same year", () => {
      const start = Temporal.Date.from("2020-10-05");
      const end = Temporal.Date.from("2020-11-10");

      expect(getTimespanTitle(start, end)).toBe("October - November 2020");
    });

    it("properly formats start and end date in different years", () => {
      const start = Temporal.Date.from("2020-12-20");
      const end = Temporal.Date.from("2021-12-20");

      expect(getTimespanTitle(start, end)).toBe(
        "December 2020 - December 2021"
      );
    });
  });

  describe("generateCalendarData", () => {
    it("generates calendar dates and timeslots", () => {
      expect(
        generateCalendarData({
          numDays: 2,
          minTime: Temporal.Time.from("06:00"),
          maxTime: Temporal.Time.from("10:00"),
          minutesPerTimeslot: 60,
          maxBookingsPerTimeslot: 2,
          currentDateTime: Temporal.DateTime.from("2020-10-10T08:30"),
          bookings: [
            {
              id: "booking1",
              start: Temporal.DateTime.from("2020-10-10T09:00"),
              end: Temporal.DateTime.from("2020-10-10T10:00"),
              isUserBooking: false,
            },
            {
              id: "booking2",
              start: Temporal.DateTime.from("2020-10-10T09:00"),
              end: Temporal.DateTime.from("2020-10-10T10:00"),
              isUserBooking: true,
            },
            {
              id: "booking3",
              start: Temporal.DateTime.from("2020-10-11T09:00"),
              end: Temporal.DateTime.from("2020-10-11T10:00"),
              isUserBooking: true,
            },
          ],
        })
      ).toEqual([
        {
          date: Temporal.Date.from("2020-10-10"),
          isToday: true,
          timeslots: [
            {
              start: Temporal.DateTime.from("2020-10-10T06:00"),
              end: Temporal.DateTime.from("2020-10-10T07:00"),
              isCurrent: false,
              isPast: true,
              isFull: false,
              userBookingId: undefined,
            },
            {
              start: Temporal.DateTime.from("2020-10-10T07:00"),
              end: Temporal.DateTime.from("2020-10-10T08:00"),
              isCurrent: false,
              isPast: true,
              isFull: false,
              userBookingId: undefined,
            },
            {
              start: Temporal.DateTime.from("2020-10-10T08:00"),
              end: Temporal.DateTime.from("2020-10-10T09:00"),
              isCurrent: true,
              isPast: false,
              isFull: false,
              userBookingId: undefined,
            },
            {
              start: Temporal.DateTime.from("2020-10-10T09:00"),
              end: Temporal.DateTime.from("2020-10-10T10:00"),
              isCurrent: false,
              isPast: false,
              isFull: true,
              userBookingId: "booking2",
            },
          ],
        },
        {
          date: Temporal.Date.from("2020-10-11"),
          isToday: false,
          timeslots: [
            {
              start: Temporal.DateTime.from("2020-10-11T06:00"),
              end: Temporal.DateTime.from("2020-10-11T07:00"),
              isCurrent: false,
              isPast: false,
              isFull: false,
              userBookingId: undefined,
            },
            {
              start: Temporal.DateTime.from("2020-10-11T07:00"),
              end: Temporal.DateTime.from("2020-10-11T08:00"),
              isCurrent: false,
              isPast: false,
              isFull: false,
              userBookingId: undefined,
            },
            {
              start: Temporal.DateTime.from("2020-10-11T08:00"),
              end: Temporal.DateTime.from("2020-10-11T09:00"),
              isCurrent: false,
              isPast: false,
              isFull: false,
              userBookingId: undefined,
            },
            {
              start: Temporal.DateTime.from("2020-10-11T09:00"),
              end: Temporal.DateTime.from("2020-10-11T10:00"),
              isCurrent: false,
              isPast: false,
              isFull: false,
              userBookingId: "booking3",
            },
          ],
        },
      ]);
    });
  });
});
