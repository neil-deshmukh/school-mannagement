import Image from 'next/image';
import AttendanceChart from './AttendanceChart';
import prisma from '../vars/prisma';

export default async function AttendanceChartWrapper() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - daysSinceMonday)

    const resData = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday
            }
        },
        select: {
            date: true,
            present: true
        }
    })
  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]

  const attendanceMap = {
    Mon: {present: 0, absent: 0},
    Tue: {present: 0, absent: 0},
    Wed: {present: 0, absent: 0},
    Thu: {present: 0, absent: 0},
    Fri: {present: 0, absent: 0}
  }

  resData.forEach(item => {
    const itemDate = new Date(item.date)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayName = days[dayOfWeek - 1]
      if (item.present) {
        attendanceMap[dayName].present++
      } else {
        attendanceMap[dayName].absent++
      }
    }
  });

  const data = days.map(day => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent
  }))
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt='settings' width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
}
