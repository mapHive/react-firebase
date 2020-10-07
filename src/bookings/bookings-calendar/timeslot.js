import React, { memo, useCallback } from "react";
import { format } from "date-fns";
import classnames from "classnames/bind";

import styles from "./timeslot.module.css";

const cx = classnames.bind(styles);

const Timeslot = ({ timeslot, onClick }) => {
  const { start, isCurrent, isPast, isFull, userBooking } = timeslot;
  const isExpired = isPast;
  const handleClick = useCallback(() => {
    onClick(timeslot);
  }, [timeslot, onClick]);

  return (
    <div
      onClick={handleClick}
      className={cx({
        container: true,
        current: isCurrent,
        expired: isExpired,
        blocked: isFull && !userBooking,
        user: !!userBooking,
      })}
    >
      {isPast ? null : <div className={styles.time}>{format(start, "p")}</div>}
      {!!userBooking ? <div className={styles.delete}>𐄂</div> : null}
    </div>
  );
};

export default memo(Timeslot);
