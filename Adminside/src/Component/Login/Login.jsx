import { IoKey } from "react-icons/io5";
import { API_BASE_URL } from "../../config";
import useLoginStore from "../../store/useLoginStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const login = useLoginStore((state) => state.login);
    const navigate = useNavigate();

    async function loginFunction() {
        try {
            const config = {
                method: "POST",
                url: `${API_BASE_URL}/V1/userLogin`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    Email: email,
                    Password: password,
                },
                withCredentials: true,
            };
            const response = await axios(config);

            if (response.status === 200 && response.data.token) {
                const token = response.data.token;
                login(token);
                toast.success("User logged in successfully");
                navigate("/"); // Redirect to the service page
            } else {
                toast.error("Something went wrong");
            }
        } catch (e) {
            console.log("Error:", e);
            toast.error("Login failed");
        }
    }

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="flex flex-row h-screen">
                <img className="object-cover w-1/2" src="/Login.webp" alt="ExproIT" />
                <div className="flex flex-col items-center justify-center w-1/2 p-8 bg-white">
                    <h1 className="text-2xl font-bold ">Sign in to ExploreIT Admin</h1>
                    <p className="mb-6 text-[#AEAEAE]">Please enter your details below to sign-in.</p>
                    <div>
                        <h1 className="mb-2 text-lg font-bold text-start">Email</h1>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-[20rem] h-10 px-2 mb-4 border-2 border-[#AEAEAE] rounded"
                        />
                        <h1 className="mt-4 mb-2 text-lg font-bold text-start">Password</h1>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-[20rem] h-10 px-2 mb-4 border-2 border-[#AEAEAE] rounded"
                        />
                    </div>
                    <button onClick={loginFunction} className="flex items-center justify-center ml-[10rem] w-[10rem] py-2 text-white bg-black rounded">
                        <IoKey className="mr-2" /> Sign in to admin
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;
