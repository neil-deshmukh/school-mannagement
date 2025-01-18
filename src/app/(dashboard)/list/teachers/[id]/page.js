import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import FormContainer from "@/app/components/FormContainer";
import Performance from "@/app/components/Performance";
import prisma from "@/app/vars/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SingleTeacher({ params }) {
  const {sessionClaims} = auth()
  const role = sessionClaims?.metadata?.role;
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: params.id,
    },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });
  if (!teacher) {
    return notFound()
  }
  let ending = "";
  if (teacher?.classes && teacher.classes[0].gradeId == "1") ending = "st";
  if (teacher?.classes && teacher.classes[0].gradeId == "2") ending = "nd";
  if (teacher?.classes && teacher.classes[0].gradeId == "3") { ending = "rd" } else if (!ending && teacher?.classes) {ending = "th"}
  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-neue py-6 px-4 rounded-md flex gap-4 flex-1">
            <div className="w-1/2">
              <Image
                src={teacher?.img || "/avatar.png"}
                alt="profile pic"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {teacher.name + " " + teacher.surname}
                </h1>
                {role == "admin" && (
                  <FormContainer type="edit" table="teacher" data={teacher} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem STudd kadsudha dasdmka hdadnabdua dakad ada dadas
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>{teacher?.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="Birth Day" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{teacher?.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="phone number" width={14} height={14} />
                  <span>+91 {teacher?.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-between flex-wrap flex-1">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleAttendance.png"
                alt="Grade"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{ending ? teacher.classes[0].gradeId + ending : "-"}%</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleBranch.png"
                alt="subjects"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleLesson.png"
                alt="lessons"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleClass.png"
                alt="Classes"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={[teacher.id]} />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">ShortCuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-neuelight"
              href={`/list/classes?supervisorId=${teacher.id}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-nelelight"
              href={`/list/students?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link
              className="p-3 rounded-md bg-neowlight"
              href={`/list/lessons?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-neuelight"
              href={`/list/assignments?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}
