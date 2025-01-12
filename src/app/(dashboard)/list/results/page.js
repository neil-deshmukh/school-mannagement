import FormContainer from "@/app/components/FormContainer";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/vars/prisma";
import { auth } from "@clerk/nextjs/server";
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
      <td className="flex items-center gap-4 p-4">
        {item.examId
          ? item.exam.lesson.subject.name
          : item.assignment.lesson.subject.name}
      </td>
      <td className="hidden md:table-cell">{item.student.name}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden lg:table-cell">
        {item.examId
          ? item.exam.lesson.teacher.name
          : item.assignment.lesson.teacher.name}
      </td>
      <td className="hidden md:table-cell">
        {item.examId
          ? item.exam.lesson.class.name
          : item.assignment.lesson.class.name}
      </td>
      <td className="hidden lg:table-cell">
        {item.examId
          ? new Intl.DateTimeFormat("en-Us").format(item.exam.endTime)
          : new Intl.DateTimeFormat("en-Us").format(item.assignment.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role == "admin" || role == "teacher") && (
            <>
              <FormContainer table="result" type="edit" data={item} />
              <FormContainer table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
export default async function ResultsList({ searchParams }) {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role;
  const currentUserId = userId;
  const columns = [
    {
      header: "Subject Name",
      accessor: "subjectname",
    },
    {
      header: "Student",
      accessor: "student",
      className: "hidden md:table-cell",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
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
          case "studentId":
            query.studentId = parseInt(value)
            break;
          case "teacherId":
            query.exam = {
              lesson: {
                teacherId: value
              }
            }
            break;
          case "search":
            query.OR = {
              exam: {
                title: { contains: value, mode: "insensitive" },
              },
              student: {
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
        { exam: { lesson: { teacher: currentUserId } } },
        { assignment: { lesson: { teacher: currentUserId } } },
      ];
      break;
    case "student":
      query.studentId = currentUserId
      break;
    case "parent":
      query.student = { parentId: currentUserId }
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        exam: {
          select: {
            lesson: {
              select: {
                subject: {
                  select: {
                    name: true,
                  },
                },
                class: {
                  select: {
                    name: true,
                  },
                },
                teacher: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        student: {
          select: {
            name: true,
          },
        },
        assignment: {
          select: {
            lesson: {
              select: {
                subject: {
                  select: {
                    name: true,
                  },
                },
                class: {
                  select: {
                    name: true,
                  },
                },
                teacher: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md h-auto m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
              <FormContainer table="result" type="plus" />
            )}
          </div>
        </div>
      </div>
      <Table cols={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
}
