import React from "react";
import { format } from "date-fns";
import classnames from "classnames/bind";

import styles from "./timeslot.module.css";

const cx = classnames.bind(styles);

const Timeslot = ({ start, end, isCurrent, isPast, bookings }) => (
  <div
    className={cx({
      container: true,
      current: isCurrent,
      past: isPast,
      isBooked: !!bookings.length,
    })}
  >
    {isPast ? "" : format(start, "p")}
  </div>
);

export default Timeslot;
