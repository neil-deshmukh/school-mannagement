import FormContainer from "@/app/components/FormContainer";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/vars/prisma";
import { ITEM_PER_PAGE } from "@/app/vars/settings";
import { auth } from "@clerk/nextjs/server";
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
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat(item.date).format()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role == "admin" && (
            <>
              <FormContainer table="announcement" type="edit" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
export default async function AnnouncementList({ searchParams }) {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role;
  const currentUserId = userId;
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role == "admin"
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
          case "search":
            query.OR = {
              title: { contains: value, mode: "insensitive" },
              class: {
                name: { contains: value, mode: "insensitive" },
              },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { classId: null },
        { class: { lessons: { some: { teacherId: currentUserId } } } },
      ];
      break;
    case "student":
      query.OR = [
        { classId: null },
        { class: { students: { some: { id: currentUserId } } } },
      ];
      break;
    case "parent":
      query.OR = [
        { classId: null },
        { class: { students: { some: { parentId: currentUserId } } } },
      ];
      break;
  }


  const [data, count] = await prisma.$transaction([
    prisma.announcements.findMany({
      where: query,
      include: {
          class: {
          select: {
            name: true
          }
          }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcements.count({
      where: query,
    }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md h-auto m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neow">
              <Image
                src="/filter.png"
                alt="Filter Button"
                width={14}
                height={14}
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neow">
              <Image
                src="/sort.png"
                alt="Sort Button"
                width={14}
                height={14}
              />
            </button>
            {role == "admin" && (
              <FormContainer table="announcement" type="plus" />
            )}
          </div>
        </div>
      </div>
      <Table cols={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
}
