import { useState } from "react";

import api from "../services/api";
import toast from "react-hot-toast";

function CreateTaskModal({
    open,
    onClose,
    onSuccess,
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

    // Modal tidak tampil
    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-2xl font-bold">
                        Create Task
                    </h1>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl"
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

                        <label className="block mb-2 font-medium">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                    </div>

                    {/* DESCRIPTION */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
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

                    {/* STATUS */}
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

                            <option value="Todo">
                                Todo
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Done">
                                Done
                            </option>

                        </select>

                    </div>

                    {/* BUTTON */}
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

                            {
                                loading
                                    ? "Saving..."
                                    : "Create"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateTaskModal;