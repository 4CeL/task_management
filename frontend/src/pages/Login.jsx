import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

import api from "../services/api";

function Login(){

    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            setLoading(true);

            const response = await api.post("/login", form);

            // Simpan Token
            localStorage.setItem("token", response.data.data.token)

            // Simpan User
            localStorage.setItem("user", JSON.stringify(response.data.data.user));

            toast.success("Login Success")

            navigate("/");
        }catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await api.post("/login-google", {
                credential: credentialResponse.credential,
            });

            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));

            toast.success("Login with Google success");

            navigate("/");

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.error?.message ||
                "Google login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                <form 
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
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
                        <label className="block mb-1 font-medium">Password</label>
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
                    {/* Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                    >
                        {
                            loading ? "Loading..." : "Login"
                        }
                    </button>
                </form>
                <div className="mt-4 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            toast.error("Google login failed");
                        }}
                    />
                </div>
                {/* Register Redirect */}
                <p className="text-center mt-4 text-sm">
                    Don't have an account? 
                    <Link 
                        to="/register"
                        className="text-blue-500 hover:underline ml-1"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;