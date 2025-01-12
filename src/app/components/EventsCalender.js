"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"


export default function EventsCalender() {
  const [value, setValue] = useState(new Date())
  const router = useRouter()
  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value}`);  
    }
  }, [value, router])
  return (
    <Calendar onChange={setValue} value={value} />
  );
}
