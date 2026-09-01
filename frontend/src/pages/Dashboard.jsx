import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import api from "../services/api";
import CreateTaskModal from "../components/CreateTaskModal";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [search, setSearch] = useState("");
    const [openSidebar, setOpenSidebar] = useState(false);

    const [activities, setActivities] = useState([]);

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const fetchActivities = async () => {
        try {

            const response = await api.get("/recent-activities");

            setActivities(response.data.data);

        } catch (error) {

            console.log(error);

        }
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === "Done") return false;

        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        return due < today;
    };

    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(
        (task) => task.status === "Todo"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const doneTasks = tasks.filter(
        (task) => task.status === "Done"
    ).length;

    const highPriorityTasks = tasks.filter(
        (task) => task.priority === "High"
    ).length;

    const overdueTasks = tasks.filter(
        (task) => isOverdue(task.due_date, task.status)
    ).length;

    const pendingTasks = todoTasks + inProgressTasks;

    const completionRate = totalTasks > 0
        ? Math.round((doneTasks / totalTasks) * 100)
        : 0;

    const lowPriorityTasks = tasks.filter(
        (task) => task.priority === "Low"
    ).length;

    const mediumPriorityTasks = tasks.filter(
        (task) => task.priority === "Medium"
    ).length;

    const isDueToday = (dueDate) => {
        if (!dueDate) return false;

        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        return due.getTime() === today.getTime();
    };

    const dueTodayTasks = tasks.filter(
        (task) => isDueToday(task.due_date)
    ).length;

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

                navigate("/login");
            }

        } finally {

            setLoading(false);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;

        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const getPercentage = (value) => {
        if (totalTasks === 0) return 0;
        return Math.round((value / totalTasks) * 100);
    };

    const taskChartData = [
        {
            name: "Todo",
            value: todoTasks,
            percentage: getPercentage(todoTasks),
            color: "#ca8a04",
        },
        {
            name: "In Progress",
            value: inProgressTasks,
            percentage: getPercentage(inProgressTasks),
            color: "#2563eb",
        },
        {
            name: "Done",
            value: doneTasks,
            percentage: getPercentage(doneTasks),
            color: "#16a34a",
        },
    ];

    useEffect(() => {

        fetchTasks();
        fetchActivities();

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

                {/* Navbar */}
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

                    {/* LEFT */}
                    <div className="flex items-center gap-4 flex-1">

                        <button
                            onClick={() => setOpenSidebar(true)}
                            className="md:hidden bg-blue-500 text-white px-3 py-2 rounded-lg"
                        >
                            ☰
                        </button>

                        {/* SEARCH */}
                        <div
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-2xl w-full max-w-xl ml-20
                                ${
                                    darkMode
                                        ? "bg-gray-700"
                                        : "bg-gray-100"
                                }
                            `}
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                />
                            </svg>

                            <input
                                type="text"
                                placeholder="Search task"
                                className={`
                                    bg-transparent outline-none w-full
                                    ${
                                        darkMode
                                            ? "placeholder:text-gray-400 text-white"
                                            : "placeholder:text-gray-500 text-black"
                                    }
                                `}
                            />

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4 ml-6">

                        {/* USER PROFILE */}
                        <div
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-2xl
                                ${
                                    darkMode
                                        ? "bg-gray-700"
                                        : "bg-gray-100"
                                }
                            `}
                        >

                            {/* AVATAR */}
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>

                            {/* USER INFO */}
                            <div className="hidden md:block">

                                <p className="font-semibold">
                                    {user?.username}
                                </p>

                                <p
                                    className={`
                                        text-sm
                                        ${
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        }
                                    `}
                                >
                                    {user?.email}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="max-w-7xl mx-auto p-6">
                    {loading && <LoadingSpinner />}

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            Dashboard
                        </h1>

                        <p className={darkMode ? "text-gray-400 mt-1" : "text-gray-500 mt-1"}>
                            Plan, prioritize, and track your tasks with ease.
                        </p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                        {/* Info Card */}
                        <div className={`p-6 rounded-2xl shadow lg:col-span-4 ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <h2 className="text-xl font-bold">
                                Welcome back, {user?.username}
                            </h2>

                            <p className={darkMode ? "text-gray-400 mt-2" : "text-gray-500 mt-2"}>
                                Use the Tasks page to manage your task list, or open the Kanban board to organize tasks by status.
                            </p>
                        </div>

                        {/* Statistics Cards */}
                        <div className={`p-5 rounded-2xl shadow lg:col-span-1 ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                Total Tasks
                            </p>
                            <h2 className="text-4xl font-bold mt-3">{totalTasks}</h2>
                        </div>

                        <div className={`p-5 rounded-2xl shadow ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                Done
                            </p>
                            <h2 className="text-4xl font-bold mt-3 text-green-600">{doneTasks}</h2>
                        </div>

                        <div className={`p-5 rounded-2xl shadow ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                In Progress
                            </p>
                            <h2 className="text-4xl font-bold mt-3 text-blue-600">{inProgressTasks}</h2>
                        </div>

                        <div className={`p-5 rounded-2xl shadow ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                Todo
                            </p>
                            <h2 className="text-4xl font-bold mt-3 text-yellow-600">{todoTasks}</h2>
                        </div>

                        <div
                            className={`
                                p-6 rounded-2xl shadow lg:col-span-2
                                ${
                                    darkMode
                                        ? "bg-gray-800 border border-gray-700"
                                        : "bg-white"
                                }
                            `}
                        >
                            <h2 className="text-xl font-bold mb-4">
                                Task Progress
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

                                {/* CHART */}
                                <div className="relative h-72">

                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={taskChartData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={75}
                                                outerRadius={110}
                                                paddingAngle={5}
                                            >
                                                {taskChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* CENTER TEXT */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <h3 className="text-4xl font-bold">
                                            {totalTasks}
                                        </h3>

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
                                            Total Tasks
                                        </p>
                                    </div>

                                </div>

                                {/* DETAIL */}
                                <div className="space-y-4">

                                    {taskChartData.map((item) => (
                                        <div
                                            key={item.name}
                                            className={`
                                                flex items-center justify-between pb-4 border-b last:border-b-0
                                                ${
                                                    darkMode
                                                        ? "border-gray-700"
                                                        : "border-gray-200"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">

                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />

                                                <div>
                                                    <p className="font-semibold">
                                                        {item.name}
                                                    </p>

                                                    <p
                                                        className={`
                                                            text-sm
                                                            ${
                                                                darkMode
                                                                    ? "text-gray-400"
                                                                    : "text-gray-500"
                                                            }
                                                        `}
                                                    >
                                                        {item.percentage}%
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="text-right">

                                                <p className="font-bold text-lg">
                                                    {item.value}
                                                </p>

                                                <p
                                                    className={`
                                                        text-sm
                                                        ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }
                                                    `}
                                                >
                                                    tasks
                                                </p>

                                            </div>
                                        </div>
                                    ))}

                                </div>

                            </div>

                            {/* SUMMARY STRIP */}
                            <div
                                className={`
                                    mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl p-4
                                    ${
                                        darkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-50"
                                    }
                                `}
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold">
                                        {totalTasks}
                                    </h3>
                                    <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                        Total
                                    </p>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-yellow-600">
                                        {todoTasks}
                                    </h3>
                                    <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                        Todo
                                    </p>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-blue-600">
                                        {inProgressTasks}
                                    </h3>
                                    <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                        Progress
                                    </p>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-green-600">
                                        {doneTasks}
                                    </h3>
                                    <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                                        Done
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div
                            className={`
                                p-6 rounded-2xl shadow lg:col-span-2
                                ${
                                    darkMode
                                        ? "bg-gray-800 border border-gray-700"
                                        : "bg-white"
                                }
                            `}
                        >

                            <h2 className="text-xl font-bold mb-4">
                                Recent Activity
                            </h2>

                            <div className="space-y-4">

                                {
                                    activities.length > 0 ? (

                                        activities.map((activity) => (

                                            <div
                                                key={activity.activity_id}
                                                className={`
                                                    flex items-start gap-3 pb-4 border-b last:border-b-0
                                                    ${
                                                        darkMode
                                                            ? "border-gray-700"
                                                            : "border-gray-200"
                                                    }
                                                `}
                                            >

                                                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>

                                                <div className="flex-1">

                                                    <p className="font-medium">
                                                        {activity.activity_message}
                                                    </p>

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
                                                        {
                                                            new Date(activity.created_at).toLocaleString(
                                                                "en-GB",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )
                                                        }
                                                    </p>

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
                                            No recent activity.
                                        </p>

                                    )
                                }

                            </div>

                        </div>

                        {/* Completion Rate */}
                        {/* <div className={`p-6 rounded-2xl shadow lg:col-span-2 ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <h2 className="text-xl font-bold mb-4">
                                Task Progress
                            </h2>

                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 rounded-full border-[18px] border-blue-500 flex items-center justify-center">
                                    <span className="text-3xl font-bold">
                                        {completionRate}%
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-green-600 font-medium">
                                        Done: {doneTasks}
                                    </p>
                                    <p className="text-blue-600 font-medium">
                                        In Progress: {inProgressTasks}
                                    </p>
                                    <p className="text-yellow-600 font-medium">
                                        Todo: {todoTasks}
                                    </p>
                                </div>
                            </div>
                        </div> */}

                        {/* Priority Summary */}
                        <div className={`p-6 rounded-2xl shadow ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <h2 className="text-xl font-bold mb-4">
                                Priority
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>High</span>
                                    <span className="font-bold text-red-600">{highPriorityTasks}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Medium</span>
                                    <span className="font-bold text-orange-600">{mediumPriorityTasks}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Low</span>
                                    <span className="font-bold text-green-600">{lowPriorityTasks}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reminder / Overdue */}
                        <div className={`p-6 rounded-2xl shadow ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <h2 className="text-xl font-bold mb-4">
                                Reminders
                            </h2>

                            <p className="text-red-600 text-4xl font-bold">
                                {overdueTasks}
                            </p>

                            <p className={darkMode ? "text-gray-400 mt-2" : "text-gray-500 mt-2"}>
                                overdue tasks need your attention.
                            </p>
                        </div>

                        

                        {/* Due Today */}
                        <div className={`p-6 rounded-2xl shadow lg:col-span-2 ${
                            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>
                            <h2 className="text-xl font-bold mb-4">
                                Today’s Focus
                            </h2>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-indigo-600">
                                        {dueTodayTasks}
                                    </p>

                                    <p className={darkMode ? "text-gray-400 mt-2" : "text-gray-500 mt-2"}>
                                        tasks due today.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setOpenCreateModal(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl"
                                >
                                    + Add Task
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <CreateTaskModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={fetchTasks}
            />

        </div>
    );
}

export default Dashboard;