import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import Calender from "@/app/components/EventsCalender";
import { auth } from "@clerk/nextjs/server";

export default function TeachersPage() {
  const {userId, sessionClaims} = auth()
  const currentUserId = userId;
  return (
    <div className="flex p-4 gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-[200vh] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer type={"teacherId"} id={[currentUserId]} />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
}
