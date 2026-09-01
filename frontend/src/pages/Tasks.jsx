import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function Tasks() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

            const response = await api.get("/get-all-tasks", {
                params: {
                    search,
                    status,
                },
            });

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

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setOpenEditModal(true);
    };

    const handleDeleteTask = async () => {
        try {
            setDeleteLoading(true);

            const response = await api.post("/delete-task", {
                task_id: selectedDeleteId,
            });
            console.log("DELETE RESPONSE:", response.data);
            toast.success("Task deleted successfully");

            setOpenDeleteModal(false);
            setSelectedDeleteId(null);

            fetchTasks();

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.error?.message ||
                "Failed delete task"
            );

        } finally {
            setDeleteLoading(false);
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

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortBy === "newest") {
            return b.task_id - a.task_id;
        }

        if (sortBy === "oldest") {
            return a.task_id - b.task_id;
        }

        if (sortBy === "due_date") {
            return (
                new Date(a.due_date || "9999-12-31") -
                new Date(b.due_date || "9999-12-31")
            );
        }

        if (sortBy === "status") {
            return a.status.localeCompare(b.status);
        }

        return 0;
    });

    const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

    useEffect(() => {
        fetchTasks();
    }, [search, status]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, sortBy]);

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
                        shadow px-6 py-4 flex justify-between items-center
                        ${
                            darkMode
                                ? "bg-gray-800 border-b border-gray-700"
                                : "bg-white"
                        }
                    `}
                >   
                    <div className="flex gap-4">
                        <button
                            onClick={() => setOpenSidebar(true)}
                            className="md:hidden bg-blue-500 text-white px-3 py-2 rounded-lg"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Tasks
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
                                Manage all your tasks here.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Add Task
                    </button>
                </div>

                <div className="max-w-5xl mx-auto p-6">
                    <div
                        className={`
                            p-4 rounded-xl shadow mb-6 flex gap-4
                            ${
                                darkMode
                                    ? "bg-gray-800 border border-gray-700"
                                    : "bg-white"
                            }
                        `}
                    >
                        <input
                            type="text"
                            placeholder="Search task..."
                            className={`
                                flex-1 border rounded-lg px-4 py-2 outline-none
                                ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                        : "bg-white border-gray-300 text-black placeholder:text-gray-500"
                                }
                            `}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`
                                border rounded-lg px-4 py-2 w-40 outline-none
                                ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-white border-gray-300 text-black"
                                }
                            `}
                        >
                            <option value="">All Status</option>
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`
                                border rounded-lg px-4 py-2 w-40 outline-none
                                ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-white border-gray-300 text-black"
                                }
                            `}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="due_date">Due Date</option>
                            <option value="status">Status</option>
                        </select>
                    </div>

                    {loading && <LoadingSpinner />}

                    <div className="grid gap-4">
                        {paginatedTasks.length > 0 ? (
                            paginatedTasks.map((task) => (
                                <div
                                    key={task.task_id}
                                    className={`
                                        p-5 rounded-xl shadow
                                        ${
                                            darkMode
                                                ? "bg-gray-800 border border-gray-700"
                                                : "bg-white"
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {task.title}
                                            </h2>

                                            <p
                                                className={`
                                                    mt-2
                                                    ${
                                                        darkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }
                                                `}
                                            >
                                                {task.description}
                                            </p>

                                            {task.due_date && (
                                                <p
                                                    className={`
                                                        text-sm mt-2
                                                        ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }
                                                    `}
                                                >
                                                    Due date:{" "}
                                                    {new Date(task.due_date).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            )}

                                            {isOverdue(task.due_date, task.status) && (
                                                <div className="mt-3">
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium">
                                                        Overdue
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleEditTask(task)}
                                                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedDeleteId(task.task_id);
                                                        setOpenDeleteModal(true);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <span
                                            className={`
                                                px-3 py-1 rounded-lg text-sm font-medium
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
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div
                                    className={`
                                        p-10 rounded-xl shadow text-center border border-dashed
                                        ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-700"
                                                : "bg-white border-gray-300"
                                        }
                                    `}
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                                        <span className="text-3xl">📝</span>
                                    </div>

                                    <h2 className="text-xl font-bold">
                                        No tasks found
                                    </h2>

                                    <p
                                        className={`
                                            mt-2
                                            ${
                                                darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }
                                        `}
                                    >
                                        You don’t have any tasks yet. Create your first task to get started.
                                    </p>

                                    <button
                                        onClick={() => setOpenCreateModal(true)}
                                        className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                                    >
                                        + Add Task
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-6">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`
                                    px-4 py-2 rounded-lg border disabled:opacity-50
                                    ${
                                        darkMode
                                            ? "border-gray-700 bg-gray-800 text-white"
                                            : "border-gray-300 bg-white text-gray-800"
                                    }
                                `}
                            >
                                Prev
                            </button>

                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`
                                    px-4 py-2 rounded-lg border disabled:opacity-50
                                    ${
                                        darkMode
                                            ? "border-gray-700 bg-gray-800 text-white"
                                            : "border-gray-300 bg-white text-gray-800"
                                    }
                                `}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <CreateTaskModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={fetchTasks}
            />

            <EditTaskModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                onSuccess={fetchTasks}
                selectedTask={selectedTask}
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false);
                    setSelectedDeleteId(null);
                }}
                onConfirm={handleDeleteTask}
                loading={deleteLoading}
            />
        </div>
    );
}

export default Tasks;