import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import loginFormSchema from "@/schema/LoginSchema";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { axiosInstance } from "@/server/axios";
import logo from "../assets/logo.png";
const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [validation, setValidation] = useState([]);
  // const [loginFailed, setLoginFailed] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const handleLogin = async (data) => {
    try {
      const response = await axiosInstance.post("/api/login", {
        email: data.email,
        password: data.password,
      });

      Cookies.set("token", response.data.data.token);
      Cookies.set("user", JSON.stringify(response.data.data.user));

      setIsAuthenticated(true);
      navigate("/home");
      toast.success("Login Successs");
    } catch (error) {
      console.log(error?.response?.data);

      // Simpan error ke state untuk ditampilkan di UI
      setValidation(error?.response?.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-inner">
        <CardHeader className="flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100  border-green-600 rounded-full flex items-center justify-center">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16h8m0 0v4m0-4H8m0 0v4M4 16a4 4 0 014-4h8a4 4 0 014 4v4m-8-10a4 4 0 110-8 4 4 0 010 8z"
              />
            </svg> */}
            <img width={"250px"} className=" text-blue-500" src={logo} />
          </div>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative flex items-center justify-center py-4">
            <span className="absolute px-2 text-sm text-gray-500 bg-white">
              Hi, Welcome back 🌟
            </span>
            <div className="w-full border-t border-gray-300" />
          </div>
          {!errors?.email && !errors?.password && validation?.message && (
            <p className="text-red-500 text-xs italic mt-2">
              {validation?.message}
            </p>
          )}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-2">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="your@example.com"
                    className={`w-full shadow px-4 py-2 border ${
                      errors?.email
                        ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                        : "border-green-200 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    } rounded-lg `}
                  />
                )}
              />
              {errors?.email && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="pb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"} // Kondisional untuk visibilitas password
                      placeholder="Enter your password"
                      className={`w-full shadow px-4 py-2 border ${
                        errors?.password
                          ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                          : "border-green-200 focus:ring-1 focus:ring-green-600 focus:outline-none"
                      } rounded-lg `}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsTyping(e.target.value.length > 0); // Set typing state
                      }}
                    />
                  )}
                />
                {errors?.password && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.password.message}
                  </p>
                )}

                {/* Icon Mata */}
                {isTyping && ( // Hanya tampil jika sedang mengetik
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <IoEyeSharp /> : <BsEyeSlashFill />}
                  </button>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2  text-white bg-green-600 rounded-lg hover:bg-green-300 transition"
            >
              Login
            </button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-gray-600">
            Not registered yet?{" "}
            <Link to={"/register"}>
              <a className="text-green-600 hover:underline">
                Create an account
              </a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
