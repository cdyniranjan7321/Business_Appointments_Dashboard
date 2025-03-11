import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 border p-2 rounded-md w-1/3">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="outline-none w-full"
        />
      </div>
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-700 text-xl cursor-pointer" />
        <FaUserCircle className="text-gray-700 text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
