import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";

function EditTaskModal({
    open,
    onClose,
    onSuccess,
    selectedTask,
}) {

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "Todo",
        due_date: "",
        priority: "Medium",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (selectedTask) {
            setForm({
                title: selectedTask.title || "",
                description: selectedTask.description || "",
                status: selectedTask.status || "Todo",
                due_date: selectedTask.due_date
                    ? new Date(selectedTask.due_date)
                        .toISOString()
                        .split("T")[0]
                    : "",
                priority: selectedTask.priority || "Medium",
            });
        }

    }, [selectedTask]);

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

            const response = await api.put(`/update-tasks/${selectedTask.task_id}`, {
                title: form.title,
                description: form.description,
                status: form.status,
                due_date: form.due_date,
                priority: form.priority,
            });
            console.log("UPDATE RESPONSE:", response.data);
            toast.success("Task updated successfully");

            onSuccess();
            onClose();

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.error?.message ||
                "Failed update task"
            );

        } finally {

            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-2xl font-bold">
                        Edit Task
                    </h1>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl"
                    >
                        ✕
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <div>
                        <label className="block mb-2 font-medium">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Priority
                        </label>

                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 outline-none"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Status
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 outline-none"
                        >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-5 py-2 rounded-xl"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditTaskModal;