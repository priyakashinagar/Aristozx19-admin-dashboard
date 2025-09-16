"use client";
import { useEffect, useState } from "react";
import { Users, LogOut } from "lucide-react";

export default function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const sidebarItems = [
    { name: "Users", icon: <Users size={18} /> },
    { name: "Logout", icon: <LogOut size={18} /> },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) {
          setError("No user info found. Please login again.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        const token = parsedUser.token; // ✅ backend से आया token इस्तेमाल करो
        if (!token) {
          setError("No token found. Please login again.");
          return;
        }

        const response = await fetch("https://aristozx19-backend.onrender.com/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch users");
          return;
        }

        setUserData(data);
      } catch (err) {
        setError("Something went wrong while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-center border-b">
          My Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium">
              {currentUser?.username || "Admin"}
            </span>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Main Table */}
        <main className="flex-1 p-6 overflow-auto">
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">{u._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.referralId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
