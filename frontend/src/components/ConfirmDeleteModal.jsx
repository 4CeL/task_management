function ConfirmDeleteModal({
    open,
    onClose,
    onConfirm,
    loading,
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

                <h2 className="text-2xl font-bold text-gray-900">
                    Delete Task?
                </h2>

                <p className="text-gray-500 mt-3">
                    This action cannot be undone. Are you sure you want to delete this task?
                </p>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="border px-5 py-2 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl disabled:opacity-60"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmDeleteModal;