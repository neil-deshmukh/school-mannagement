import Image from "next/image";
import EventsCalender from "./EventsCalender";
import EventsList from "./EventsList";

export default async function EventsCalenderWrapper({ searchParams }) {
    const {date} = searchParams
  return (
    <div className="bg-white p-4 rounded-md">
      <EventsCalender />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/more.png" alt="img" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventsList dateParam={date} />
      </div>
    </div>
  );
}
