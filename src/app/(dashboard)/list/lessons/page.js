import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { auth } from "@clerk/nextjs/server";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/vars/prisma";
import { ITEM_PER_PAGE } from "@/app/vars/settings";
import Image from "next/image";
import Link from "next/link";



const renderRow = (item) => {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role;
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-nelelight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td className="hidden md:table-cell">{item.class.name}</td>
      <td className="hidden lg:table-cell">{item.teacher.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role == "admin" && (
            <>
              <FormModal table="lesson" type="edit" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
export default async function LessonsList({ searchParams }) {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role;
  const columns = [
    {
      header: "Subject Name",
      accessor: "subjectname",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    ...(role == "admin" || role == "teacher"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];
  const { page, ...queryParams } = searchParams;
  const p = (page && parseInt(page)) || 1;

  const query = {};

  if (queryParams) {
    for (let [key, value] of Object.entries(queryParams)) {
      if (value) {
        switch (key) {
          case "classId":
            query.classId = parseInt(value)
            break;
          case "teacherId":
            query.teacherId = value
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              { teacher: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }
  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        teacher: true,
        class: true,
        subject: true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({
      where: query,
    }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md h-auto m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neow">
              <Image src="/filter.png" alt="Button" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neow">
              <Image src="/sort.png" alt="Button" width={14} height={14} />
            </button>
            {(role == "admin" || role == "teacher") && (
              <FormModal table="lesson" type="plus" />
            )}
          </div>
        </div>
      </div>
      <Table cols={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
}