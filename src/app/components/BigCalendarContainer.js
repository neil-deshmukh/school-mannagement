import { adjustScheduleToCurrentWeek } from "../vars/data"
import prisma from "../vars/prisma"
import MyCalendar from "./BigCalender"


export default async function BigCalendarContainer({ type, id }) {
    const resData = await prisma.lesson.findMany({
        where: {
            ...(type === "teacherId" ? { teacherId: {in: id}} : {classId: {in: id} })
        }
    })
    const data = resData.map(lesson => {
        return {
            title: lesson.name,
            start: lesson.startTime,
            end: lesson.endTime
        }
    })
  const Schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="h-[98%]">
        <MyCalendar data={Schedule} />
    </div>
  )
}
