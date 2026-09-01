import { useDraggable } from "@dnd-kit/core";

function KanbanTaskCard({
    task,
    darkMode,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.task_id,
        data: {
            task,
        },
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                rounded-xl p-4 border cursor-grab active:cursor-grabbing transition
                ${
                    isDragging
                        ? "opacity-50"
                        : ""
                }
                ${
                    darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                }
            `}
        >
            <h3 className="font-bold">
                {task.title}
            </h3>

            <p
                className={`
                    text-sm mt-2
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
                        text-xs mt-3
                        ${
                            darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                        }
                    `}
                >
                    Due:{" "}
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

            <div className="flex gap-2 mt-3">
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
        </div>
    );
}

export default KanbanTaskCard;