import Image from "next/image";
import prisma from "../vars/prisma";
import FinanceChart from "./FinanceChart";

export default async function FinanceChartContainer() {
    const [students, teachers, admins] = await prisma.$transaction([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.admin.count(),
    ]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const data = months.map((month, i) => {
        return {
          name: month,
          income: i > 3 ? students * 4000 : students * 2000,
          expense:
            i > 5
              ? teachers * 5000 + admins * 9000
              : teachers * 6000 + admins * 10000,
        };
    })
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="setting icon (hardcoded)" width={20} height={20} />
      </div>
      <FinanceChart data={data} />
    </div>
  );
}
