import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Navbar />

        {/* Dashboard Content */}
        <div className="p-6 pt-16">
          <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
          <p className="mt-2 text-gray-700">Here is your main content.</p>
        </div>
      </div>
    </div>
  );
}
