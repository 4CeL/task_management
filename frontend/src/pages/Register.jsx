import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

function Register(){
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try{
            setLoading(true)
            const response = await api.post("/register", form);
            toast.success(response.data.message);
            navigate("/login")
        } catch (error){
            console.log(error);
            toast.error(error.response?.data?.error?.message || "Register Failed");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text_center mb-6">Register</h1>
                <form 
                    onSubmit={handleRegister}
                    className="space-y-4"
                >
                    {/* Username */}
                    <div>
                        <label className="block mb-1 font_medium">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block mb-1 font_medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label className="block mb-1 font_medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>
                <p className="text-center mt-4 text-sm">
                    Already have an account?
                    <Link to="/login" className="text-blue-500 ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;