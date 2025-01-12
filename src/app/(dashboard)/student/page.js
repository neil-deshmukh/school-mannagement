import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import Calender from "@/app/components/EventsCalender";
import prisma from "@/app/vars/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function StudentPage() {
  const {userId, sessionClaims} = auth()
  const currentUserId = userId;
  const resData = await prisma.student.findUnique({
    where: {
      id: currentUserId
    },
    include: {
      class: true
    }
  })
  return (
    <div className="flex p-4 gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-[200vh] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({resData.class?.name})</h1>
          <BigCalendarContainer type="classId" id={[resData.classId]}  />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Calender />
        <Announcements />
      </div>
    </div>
  );
}
