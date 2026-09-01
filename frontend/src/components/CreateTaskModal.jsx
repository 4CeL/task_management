import { useState } from "react";

import api from "../services/api";
import toast from "react-hot-toast";

function CreateTaskModal({
    open,
    onClose,
    onSuccess,
    darkMode,
}) {

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "Todo",
        due_date: "",
        priority: "Medium",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post(
                "/insert-tasks",
                form
            );
            console.log("INSERT RESPONSE:", response.data);
            toast.success("Task insert successfully");

            // Reset form
            setForm({
                title: "",
                description: "",
                status: "Todo",
                due_date: "",
                priority: "Medium",
            });

            // Refresh task
            onSuccess();

            // Close modal
            onClose();

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.error?.message ||
                "Failed create task"
            );

        } finally {

            setLoading(false);
        }
    };

    if (!open) return null;

    const inputClass = `
        w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition
        ${
            darkMode
                ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
        }
    `;

    const selectClass = `
        w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition
        ${
            darkMode
                ? "bg-slate-800 border-slate-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
        }
    `;

    const labelClass = `block mb-2 font-medium text-sm ${darkMode ? "text-slate-300" : "text-gray-700"}`;

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

            <div
                className={`
                    w-full max-w-lg rounded-2xl p-6 shadow-2xl border
                    ${
                        darkMode
                            ? "bg-slate-900 border-slate-700 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                    }
                `}
            >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-2xl font-bold">
                        Create Task
                    </h1>

                    <button
                        onClick={onClose}
                        className={`
                            w-8 h-8 flex items-center justify-center rounded-full text-lg transition
                            ${darkMode ? "hover:bg-slate-700 text-slate-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-black"}
                        `}
                    >
                        ✕
                    </button>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* TITLE */}
                    <div>
                        <label className={labelClass}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            rows={4}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* DUE DATE */}
                    <div>
                        <label className={labelClass}>Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* PRIORITY */}
                    <div>
                        <label className={labelClass}>Priority</label>
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className={selectClass}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className={selectClass}
                        >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className={`
                                border px-5 py-2 rounded-xl font-medium transition
                                ${darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
                            `}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-5 py-2 rounded-xl font-medium transition"
                        >
                            {loading ? "Saving..." : "Create"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateTaskModal;