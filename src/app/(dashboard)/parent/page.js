import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import Calender from "@/app/components/EventsCalender";
import prisma from "@/app/vars/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function ParentPage() {
  const {userId, sessionClaims} = auth()
  const currentUserId = userId;
  const resData = await prisma.student.findMany({
    where: {
      parentId: currentUserId
    }
  })
  return (
    <div className="flex p-4 gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-[200vh] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({resData[1] ? resData[0].name + ", " + resData[1].name : resData[0].name})</h1>
          <BigCalendarContainer type="classId" id={resData.map(obj => obj.classId)} />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Calender />
        <Announcements />
      </div>
    </div>
  );
}
