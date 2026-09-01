import { useDroppable } from "@dnd-kit/core";

function KanbanColumn({
    column,
    children,
    darkMode,
}) {
    const { setNodeRef } = useDroppable({
        id: column.status,
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                rounded-2xl p-4 min-h-[500px]
                ${
                    darkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white shadow"
                }
            `}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    {column.title}
                </h2>

                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${column.color}`}>
                    {column.count}
                </span>
            </div>

            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

export default KanbanColumn;