import { getTimespanTitle, generateDatesAndTimeSlots } from "./lib";

describe("booking-calendar/lib", () => {
  describe("getTimespanTitle", () => {
    it("properly formats start and end date in same month", () => {
      const start = new Date("2020-10-05");
      const end = new Date("2020-10-10");

      expect(getTimespanTitle(start, end)).toBe("October 2020");
    });

    it("properly formats start and end date in same year", () => {
      const start = new Date("2020-10-05");
      const end = new Date("2020-11-10");

      expect(getTimespanTitle(start, end)).toBe("October - November 2020");
    });

    it("properly formats start and end date in different years", () => {
      const start = new Date("2020-12-20");
      const end = new Date("2021-01-05");

      expect(getTimespanTitle(start, end)).toBe("December 2020 - January 2021");
    });
  });

  describe("generateDatesAndTimeSlots", () => {
    it("generates calendar dates and timeslots", () => {
      expect(
        generateDatesAndTimeSlots({
          fromDate: new Date(2020, 10, 10),
          numDays: 2,
          minutesPerTimeslot: 60,
          minTime: "06:00",
          maxTime: "10:00",
          currentDate: new Date(2020, 10, 10, 8, 30),
          bookings: [
            {
              start: new Date(2020, 10, 10, 9, 0),
              end: new Date(2020, 10, 10, 10, 0),
              isUserBooking: false,
            },
          ],
        })
      ).toEqual([
        {
          date: new Date(2020, 10, 10),
          isToday: true,
          timeslots: [
            {
              start: new Date(2020, 10, 10, 6, 0),
              end: new Date(2020, 10, 10, 7, 0),
              bookings: [],
              isCurrent: false,
              isPast: true,
            },
            {
              start: new Date(2020, 10, 10, 7, 0),
              end: new Date(2020, 10, 10, 8, 0),
              bookings: [],
              isCurrent: false,
              isPast: true,
            },
            {
              start: new Date(2020, 10, 10, 8, 0),
              end: new Date(2020, 10, 10, 9, 0),
              bookings: [],
              isCurrent: true,
              isPast: false,
            },
            {
              start: new Date(2020, 10, 10, 9, 0),
              end: new Date(2020, 10, 10, 10, 0),
              bookings: [
                {
                  start: new Date(2020, 10, 10, 9, 0),
                  end: new Date(2020, 10, 10, 10, 0),
                  isUserBooking: false,
                },
              ],
              isCurrent: false,
              isPast: false,
            },
          ],
        },
        {
          date: new Date(2020, 10, 11),
          isToday: false,
          timeslots: [
            {
              start: new Date(2020, 10, 11, 6, 0),
              end: new Date(2020, 10, 11, 7, 0),
              isCurrent: false,
              bookings: [],
              isPast: false,
            },
            {
              start: new Date(2020, 10, 11, 7, 0),
              end: new Date(2020, 10, 11, 8, 0),
              isCurrent: false,
              bookings: [],
              isPast: false,
            },
            {
              start: new Date(2020, 10, 11, 8, 0),
              end: new Date(2020, 10, 11, 9, 0),
              isCurrent: false,
              bookings: [],
              isPast: false,
            },
            {
              start: new Date(2020, 10, 11, 9, 0),
              end: new Date(2020, 10, 11, 10, 0),
              isCurrent: false,
              bookings: [],
              isPast: false,
            },
          ],
        },
      ]);
    });
  });
});
