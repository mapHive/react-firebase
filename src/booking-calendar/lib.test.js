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

  describe.todo("generateDatesAndTimeSlots");
});
