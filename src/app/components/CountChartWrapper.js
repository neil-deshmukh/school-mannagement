import Image from "next/image";
import prisma from "../vars/prisma";
import CountChart from "./CountChart";

export default async function CountChartWrapper() {
    const data = await prisma.student.groupBy({
        by: ["sex"],
        _count: true
    })
    const boys = data.find(obj => obj.sex = "MALE")._count
    const girls = data.find((obj) => (obj.sex = "FEMALE"))._count;
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="Settings" width={20} height={20} />
      </div>
      <CountChart boys={boys} girls={girls} />
      <div className="flex justify-center gap-16">
        <div>
          <div className="w-5 h-5 bg-neue rounded-full"></div>
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({Math.round((boys / (boys + girls)) * 100)}%)
          </h2>
        </div>
        <div>
          <div className="w-5 h-5 bg-neow rounded-full"></div>
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({Math.round((girls / (boys + girls)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
}
