import UserCard from "../../components/UserCard";
import Announcements from "@/app/components/Announcements";
import CountChartWrapper from "@/app/components/CountChartWrapper";
import AttendanceChartWrapper from "@/app/components/AttendanceChartWrapper";
import EventsCalenderWrapper from "@/app/components/EventsCalenderWrapper";
import FinanceChartContainer from "@/app/components/FinanceChartContainer";

export default function AdminPage({searchParams}) {
  return (
    <div className="flex p-4 gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard form="student" />
          <UserCard form="teacher" />
          <UserCard form="staff" />
          <UserCard form="parent" />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[350px]">
            <CountChartWrapper />
          </div>
          <div className="w-full lg:w-2/3 h-[350px]">
            <AttendanceChartWrapper />
          </div>
        </div>
        <div className="w-full h-[400px]">
          <FinanceChartContainer />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventsCalenderWrapper searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
}
