import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Navbar() {
  const user = await currentUser();
  const role = user.publicMetadata?.role
  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <div>
          <Image src="/search.png" alt="Search Icon" width={14} height={14} />
        </div>
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor- relative">
          <Image src="/announcement.png" alt="announcemments" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Neil D</span>
          <span className="text-[10px] text-gray-500 text-right">{role[0].toUpperCase() + role.slice(1)}</span>
        </div>
        {/* <Image src="/avatar.png" width={36} height={36} className="rounded-full" /> */}
        <UserButton />
      </div>
    </div>
  );
}