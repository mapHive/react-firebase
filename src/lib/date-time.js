import { Temporal } from "proposal-temporal";
import { format } from "date-fns";

export const formatTemporal = (
  date, // Temporal.DateX
  ...rest
) => format(new Date(date.toJSON()), ...rest);

export const compareDateTimes = (
  one, // Temporal.DateTime
  two // Temporal.DateTime
) => Temporal.DateTime.compare(one, two);

export const getCurrentDateTimeInTimezone = (
  timezone // IANA valid timezone
) => Temporal.Instant.fromEpochMilliseconds(Date.now()).toDateTime(timezone);
