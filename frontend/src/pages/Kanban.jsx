import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

import { DndContext } from "@dnd-kit/core";
import KanbanColumn from "../components/KanbanColumn";
import KanbanTaskCard from "../components/KanbanTaskCard";

function Kanban() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const task = active.data.current.task;
        const newStatus = over.id;

        if (task.status === newStatus) return;

        try {
            await api.put(`/update-tasks/${task.task_id}`, {
                title: task.title,
                description: task.description,
                status: newStatus,
                due_date: task.due_date
                    ? new Date(task.due_date).toISOString().split("T")[0]
                    : null,
                priority: task.priority,
            });

            toast.success("Task status updated");

            fetchTasks();

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.error?.message ||
                "Failed update task status"
            );
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const columns = [
        {
            title: "Todo",
            status: "Todo",
            color: "bg-yellow-100 text-yellow-700",
        },
        {
            title: "In Progress",
            status: "In Progress",
            color: "bg-orange-100 text-orange-700",
        },
        {
            title: "Done",
            status: "Done",
            color: "bg-green-100 text-green-700",
        },
    ];

    return (
        <div
            className={`
                min-h-screen flex
                ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-orange-50 text-gray-900"
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
                        shadow px-6 py-4 flex items-center justify-between border-b
                        ${
                            darkMode
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-gray-200"
                        }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOpenSidebar(true)}
                            className="md:hidden bg-orange-500 text-white px-3 py-2 rounded-lg"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Tasks Status Board
                            </h1>

                            <p
                                className={`
                                    text-sm mt-1
                                    ${
                                        darkMode
                                            ? "text-slate-400"
                                            : "text-gray-500"
                                    }
                                `}
                            >
                                View your tasks by progress status.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <DndContext onDragEnd={handleDragEnd}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {columns.map((column) => {

                                    const columnTasks = getTasksByStatus(column.status);

                                    return (
                                        <KanbanColumn
                                            key={column.status}
                                            column={{
                                                ...column,
                                                count: columnTasks.length,
                                            }}
                                            darkMode={darkMode}
                                        >

                                            {columnTasks.length > 0 ? (

                                                columnTasks.map((task) => (
                                                    <KanbanTaskCard
                                                        key={task.task_id}
                                                        task={task}
                                                        darkMode={darkMode}
                                                    />
                                                ))

                                            ) : (

                                                <div
                                                    className={`
                                                        text-center text-sm py-10 border border-dashed rounded-xl
                                                        ${
                                                            darkMode
                                                                ? "text-slate-400 border-slate-700"
                                                                : "text-gray-500 border-gray-300"
                                                        }
                                                    `}
                                                >
                                                    No tasks
                                                </div>

                                            )}

                                        </KanbanColumn>
                                    );
                                })}

                            </div>

                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Kanban;