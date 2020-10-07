import React, { memo, useCallback } from "react";
import classnames from "classnames/bind";

import styles from "./timeslot.module.css";
import { formatTemporal } from "../../lib/date-time";

const cx = classnames.bind(styles);

const Timeslot = ({ timeslot, onClick }) => {
  const { start, isCurrent, isPast, isFull, userBookingId } = timeslot;
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
        blocked: isFull && !userBookingId,
        user: !!userBookingId,
      })}
    >
      {isPast ? null : (
        <div className={styles.time}>{formatTemporal(start, "p")}</div>
      )}
      {!!userBookingId ? <div className={styles.delete}>𐄂</div> : null}
    </div>
  );
};

export default memo(Timeslot);
