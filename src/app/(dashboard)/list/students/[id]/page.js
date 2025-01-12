import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import FormContainer from "@/app/components/FormContainer";
import Performance from "@/app/components/Performance";
import StudentsAttendanceCard from "@/app/components/StudentsAttendanceCard";
import prisma from "@/app/vars/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function SingleStudent({ params }) {
  const {sessionClaims} = auth()
  const role = sessionClaims?.metadata?.role;
  const student = await prisma.student.findUnique({
    where: {
      id: params.id,
    },
    include: {
      class: {
        include: {
          _count: {
            select: {lessons: true}
          }
        }
      }
    },
  });
  if (!student) {
    return notFound()
  }
  let ending = "th"
  if (student.class.gradeId == "1") ending = "st";
  if (student.class.gradeId == "2") ending = "nd";
  if (student.class.gradeId == "3") ending = "rd";
  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-neue py-6 px-4 rounded-md flex gap-4 flex-1">
            <div className="w-1/3">
              <Image
                src={student.img || "/avatar.png"}
                alt="Profile Picture"
                width={144}
                height={144}
                className="w-26 h-26 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.name + " " + student.surname}
                </h1>
                {role == "admin" && (
                  <FormContainer type="edit" table="student" data={student} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem STudd kadsudha dasdmka hdadnabdua dakad ada dadas
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="Birth Day" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="Phone Number" width={14} height={14} />
                  <span>{student.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-between flex-wrap flex-1">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleAttendance.png"
                alt="attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="loading...">
                <StudentsAttendanceCard id={student.id} />
              </Suspense>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleBranch.png"
                alt="Grade"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {student.class.gradeId + ending}
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleLesson.png"
                alt="Lessons"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class._count.lessons}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full lg:w-full md:w-[48%] xl:w-[45%]">
              <Image
                src="/singleClass.png"
                alt="Class"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="classId" id={[student.class.id]} />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">ShortCuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-neuelight"
              href={`/list/teachers?classId=${2}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-nelelight"
              href={`/list/teachers?classId=${2}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-neowlight"
              href={`/list/results?studentId=${"student2"}`}
            >
              Student&apos;s Results
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?classId=${2}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-neuelight"
              href={`/list/assignments?classId=${2}`}
            >
              Student&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}
