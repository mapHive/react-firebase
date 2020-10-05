import React, { memo } from "react";
import "date-fns";

import BookingsCalendar from "./bookings-calendar";

const BookingsScreen = () => <BookingsCalendar />;

export default memo(BookingsScreen);
