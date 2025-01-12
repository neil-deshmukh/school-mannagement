import Link from "next/link";
import "../globals.css";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {
  return (
    <div className="h-screen flex">
      <div className="w-1/6 md:w-[8%] lg:w-[16%] xl:w-1/6 p-4">
        <Link href="/" className="flex items-center justify-center gap-2 lg:justify-start">
          <Image src="/favicon.ico" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">Schoolizer</span>
        </Link>
        <Sidebar />
      </div>
      <div className="w-5/6 md:w-[92%] lg:w-[84%] xl-5/6 bg-[#F7F8FA] overflow-scroll min-h-[1000px]">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
