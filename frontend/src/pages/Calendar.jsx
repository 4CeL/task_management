import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

function CalendarPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await api.get("/get-all-tasks");
            setTasks(response.data.data);

        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Session expired. Please login again.");
                navigate("/login");
            }

        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toISOString().split("T")[0];
    };

    const selectedDateString = formatDate(selectedDate);

    const tasksOnSelectedDate = tasks.filter((task) => {
        if (!task.due_date) return false;
        return formatDate(task.due_date) === selectedDateString;
    });

    const getTasksByDate = (date) => {
        const dateString = formatDate(date);

        return tasks.filter((task) => {
            if (!task.due_date) return false;
            return formatDate(task.due_date) === dateString;
        });
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === "Done") return false;

        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        return due < today;
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div
            className={`
                min-h-screen flex
                ${
                    darkMode
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900"
                }
            `}
        >
            <Sidebar
                user={user}
                handleLogout={handleLogout}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
            />

            <div className="flex-1">
                <div
                    className={`
                        px-6 py-4 flex items-center justify-between border-b
                        ${
                            darkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-white border-gray-200"
                        }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOpenSidebar(true)}
                            className="md:hidden bg-blue-500 text-white px-3 py-2 rounded-lg"
                        >
                            ☰
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Calendar
                            </h1>

                            <p
                                className={`
                                    text-sm mt-1
                                    ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }
                                `}
                            >
                                View tasks by due date.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div
                                className={`
                                    lg:col-span-2 p-6 rounded-2xl shadow
                                    ${
                                        darkMode
                                            ? "bg-gray-800 border border-gray-700"
                                            : "bg-white"
                                    }
                                `}
                            >
                                <Calendar
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    tileContent={({ date, view }) => {
                                        if (view !== "month") return null;

                                        const dayTasks = getTasksByDate(date);

                                        if (dayTasks.length === 0) return null;

                                        return (
                                            <div className="flex justify-center mt-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            </div>
                                        );
                                    }}
                                    className="w-full rounded-xl border-none"
                                />
                            </div>

                            <div
                                className={`
                                    p-6 rounded-2xl shadow
                                    ${
                                        darkMode
                                            ? "bg-gray-800 border border-gray-700"
                                            : "bg-white"
                                    }
                                `}
                            >
                                <h2 className="text-xl font-bold">
                                    Tasks on{" "}
                                    {selectedDate.toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </h2>

                                <div className="mt-5 space-y-4">
                                    {tasksOnSelectedDate.length > 0 ? (
                                        tasksOnSelectedDate.map((task) => (
                                            <div
                                                key={task.task_id}
                                                className={`
                                                    p-4 rounded-xl border
                                                    ${
                                                        darkMode
                                                            ? "bg-gray-700 border-gray-600"
                                                            : "bg-gray-50 border-gray-200"
                                                    }
                                                `}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div>
                                                        <h3 className="font-bold">
                                                            {task.title}
                                                        </h3>

                                                        <p
                                                            className={`
                                                                text-sm mt-1
                                                                ${
                                                                    darkMode
                                                                        ? "text-gray-300"
                                                                        : "text-gray-600"
                                                                }
                                                            `}
                                                        >
                                                            {task.description}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`
                                                            px-2 py-1 rounded-md text-xs font-medium
                                                            ${
                                                                task.status === "Done"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : task.status === "In Progress"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                            }
                                                        `}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2 mt-3">
                                                    {isOverdue(task.due_date, task.status) && (
                                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium">
                                                            Overdue
                                                        </span>
                                                    )}

                                                    <span
                                                        className={`
                                                            px-2 py-1 rounded-md text-xs font-medium
                                                            ${
                                                                task.priority === "High"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : task.priority === "Medium"
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-green-100 text-green-700"
                                                            }
                                                        `}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p
                                            className={
                                                darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }
                                        >
                                            No tasks due on this date.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;