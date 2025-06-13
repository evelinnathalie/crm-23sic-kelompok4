import { Search, User } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-[#FAFAF8] border-b border-[#E4E6DC] px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="text-sm text-gray-500">
        Pages / <span className="text-[#A3B18A] font-semibold">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm border border-[#E4E6DC] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer text-sm text-[#444444] hover:text-[#A3B18A]">
          <User className="w-4 h-4" />
          Log Out
        </div>
      </div>
    </header>
  );
};

export default Header;
