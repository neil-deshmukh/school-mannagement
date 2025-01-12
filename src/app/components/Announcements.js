import prisma from "@/app/vars/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Announcements() {
  const {userId, sessionClaims} = auth()
  const role = sessionClaims?.metadata?.role;
  const currentUserId = userId;
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId } } },
    student: { students: { some: { id: currentUserId } } },
    parent: { students: { some: { parentId: currentUserId } } },
  };
  const data = await prisma.announcements.findMany({
    take: 3,
    orderBy: {date: "desc"},
    where: {...(role !== "admin" && {
      OR: [
        { classId: null },
        {class: roleConditions[role]}
      ]
    })}
  })
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View all</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && <div className="bg-neuelight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[0]?.title}</h2>
            <span className="text-xs text-gray-400 bd-white rounded-md px-1 py-1">
              {data[0]?.date.toLocaleTimeString("hi-IN")}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data[0]?.description}</p>
        </div>}
        {data[1] && <div className="bg-nelelight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[1]?.title}</h2>
            <span className="text-xs text-gray-400 bd-white rounded-md px-1 py-1">
              {data[1]?.date.toLocaleTimeString("hi-IN")}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data[1]?.description}</p>
        </div>}
        {data[2] && <div className="bg-neowlight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[2]?.title}</h2>
            <span className="text-xs text-gray-400 bd-white rounded-md px-1 py-1">
              {data[2]?.date.toLocaleTimeString("hi-IN")}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data[2]?.description}</p>
        </div>}
      </div>
    </div>
  );
}
