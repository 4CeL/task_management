import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [isEditUsername, setIsEditUsername] = useState(false);
    const [username, setUsername] = useState(user?.username || "");
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

    const handleUpdateUsername = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.put("/update-username", {
                username,
            });

            const updatedUser = {
                ...user,
                username: response.data.data.username,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Username updated successfully");
            setIsEditUsername(false);

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.error?.message ||
                "Failed update username"
            );

        } finally {
            setLoading(false);
        }
    };

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
                        shadow px-6 py-4 flex mr-3
                        ${
                            darkMode
                                ? "bg-gray-800 border-b border-gray-700"
                                : "bg-white"
                        }
                    `}
                >
                    <button
                        onClick={() => setOpenSidebar(true)}
                        className="md:hidden bg-blue-500 text-white px-3 py-2 rounded-lg"
                    >
                        ☰
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Profile
                        </h1>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto p-6">
                    <div
                        className={`
                            rounded-xl shadow p-6
                            ${
                                darkMode
                                    ? "bg-gray-800 border border-gray-700"
                                    : "bg-white"
                            }
                        `}
                    >
                        <h2 className="text-xl font-bold mb-6">
                            Account Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className={`
                                    text-sm
                                    ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }
                                `}>
                                    Username
                                </p>

                                {
                                    isEditUsername ? (
                                        <form
                                            onSubmit={handleUpdateUsername}
                                            className="mt-2 flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className={`
                                                    flex-1 border rounded-lg px-4 py-2
                                                    ${
                                                        darkMode
                                                            ? "bg-gray-700 border-gray-600 text-white"
                                                            : "bg-white border-gray-300 text-black"
                                                    }
                                                `}
                                                autoFocus
                                            />

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                {loading ? "Saving..." : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUsername(user?.username || "");
                                                    setIsEditUsername(false);
                                                }}
                                                className="border px-4 py-2 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-lg font-semibold">
                                                {user?.username}
                                            </p>

                                            <button
                                                onClick={() => setIsEditUsername(true)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )
                                }
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Email
                                </p>
                                <p className="text-lg font-semibold">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;