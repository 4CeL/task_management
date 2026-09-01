import {
    LayoutDashboard,
    CheckSquare,
    User,
    LogOut,
    Moon,
    Sun,
    Columns3,
    CalendarDays
} from "lucide-react";
import toast from "react-hot-toast";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({
    user,
    handleLogout,
    darkMode,
    toggleDarkMode,
    openSidebar,
    setOpenSidebar,
}) {

    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* OVERLAY MOBILE */}
            {
                openSidebar && (
                    <div
                        onClick={() => setOpenSidebar(false)}
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    />
                )
            }
            <div
                className={`
                    fixed md:static top-0 left-0 z-50
                    w-64 min-h-screen border-r flex flex-col justify-between p-6
                    transform transition-transform duration-300
                    ${openSidebar ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                    ${
                        darkMode
                            ? "bg-slate-900 border-slate-700"
                            : "bg-white border-gray-200"
                    }
                `}
            >

                <div>
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-orange-500">
                            TaskFlow
                        </h1>

                        <p className="text-gray-500 text-sm mt-2">
                            Manage your daily productivity
                        </p>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                navigate("/");
                                setOpenSidebar(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
                                ${
                                    isActive("/")
                                        ? darkMode
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "bg-orange-50 text-orange-500"
                                        : darkMode
                                            ? "hover:bg-slate-900 text-slate-400"
                                            : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate("/kanban");
                                setOpenSidebar(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
                                ${
                                    isActive("/kanban")
                                        ? darkMode
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "bg-orange-50 text-orange-500"
                                        : darkMode
                                            ? "hover:bg-slate-900 text-slate-400"
                                            : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <Columns3 size={20} />
                            <span>Tasks Board</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate("/tasks");
                                setOpenSidebar(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
                                ${
                                    isActive("/tasks")
                                        ? darkMode
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "bg-orange-50 text-orange-500"
                                        : darkMode
                                            ? "hover:bg-slate-900 text-slate-400"
                                            : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <CheckSquare size={20} />
                            <span>Tasks</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate("/calendar");
                                setOpenSidebar(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
                                ${
                                    isActive("/calendar")
                                        ? darkMode
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "bg-orange-50 text-orange-500"
                                        : darkMode
                                            ? "hover:bg-slate-900 text-slate-400"
                                            : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <CalendarDays size={20} />
                            <span>Calendar</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate("/profile");
                                setOpenSidebar(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
                                ${
                                    isActive("/profile")
                                        ? darkMode
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "bg-orange-50 text-orange-500"
                                        : darkMode
                                            ? "hover:bg-slate-900 text-slate-400"
                                            : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <User size={20} />
                            <span>Profile</span>
                        </button>
                    </div>
                </div>

                <div>
                    <button
                        onClick={toggleDarkMode}
                        className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-xl transition mb-5

                            ${
                                darkMode
                                    ? "bg-slate-800 text-slate-200"
                                    : "bg-orange-50 text-gray-700"
                            }
                        `}
                    >

                        <div className="flex items-center gap-3">

                            {
                                darkMode
                                    ? <Moon size={20} />
                                    : <Sun size={20} />
                            }

                            <span>
                                Dark Mode
                            </span>

                        </div>

                        {/* TOGGLE */}
                        <div
                            className={`
                                w-12 h-6 flex items-center rounded-full p-1 transition

                                ${
                                    darkMode
                                        ? "bg-orange-500"
                                        : "bg-gray-300"
                                }
                            `}
                        >

                            <div
                                className={`
                                    bg-white w-4 h-4 rounded-full shadow-md transform transition

                                    ${
                                        darkMode
                                            ? "translate-x-6"
                                            : "translate-x-0"
                                    }
                                `}
                            />

                        </div>

                    </button>
                    <div className={`
                        border rounded-2xl p-4 mb-4

                        ${
                            darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-orange-50 border-orange-100"
                        }
                    `}>
                        <p className={`
                            font-bold

                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-gray-800"
                            }
                        `}>
                            {user?.username}
                        </p>

                        <p className={`
                            text-sm mt-1 break-all

                            ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-gray-500"
                            }
                        `}>
                            {user?.email}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

            </div>
        </>
    );
}

export default Sidebar;