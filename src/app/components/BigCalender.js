"use client"
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "../vars/data";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState } from "react";

const localizer = momentLocalizer(moment);

const MyCalendar = ({data}) => {
  const [view, setView] = useState(Views.WORK_WEEK)
  const handleChangeView = (selectedView) => {
    setView(selectedView)
  }
  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      onView={handleChangeView}
      style={{ height: "98%" }}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 22, 0, 0)}
    />
  );
}

export default MyCalendar