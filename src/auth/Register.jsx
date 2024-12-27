import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import registerSchema from "@/schema/RegisterSchema";
import { toast } from "sonner";
import axiosInstance from "@/server/axios";
import logo from "../assets/logo.png";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [validation, setValidation] = useState("");
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data) => {
    try {
      const response = await axiosInstance.post("/api/register", {
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        password: data.password,
      });
      navigate("/login");
      toast("Register Success");
    } catch (error) {
      if (error?.response?.data?.errors) {
        const errorsArray = error.response.data.errors;
        const validationErrors = errorsArray.reduce((acc, curr) => {
          acc[curr.path] = curr.msg;
          return acc;
        }, {});
        setValidation(validationErrors);
      } else {
        setValidation({
          general: error?.response?.data?.message || "An error occurred",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg shadow-inner">
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
          <CardTitle>Register</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {validation.general && (
              <p className="text-red-500 text-xs italic mt-2">
                {validation.general}
              </p>
            )}
            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Full Name"
                      className={`w-full shadow px-4 py-2 border ${
                        errors?.name
                          ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                          : "border-green-300 focus:ring-1 focus:ring-green-600 focus:outline-none"
                      } rounded-lg `}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Username"
                      className={`w-full shadow px-4 py-2 border ${
                        errors?.username
                          ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                          : "border-green-200 focus:ring-1 focus:ring-green-700 focus:outline-none"
                      } rounded-lg `}
                    />
                  )}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
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
                      placeholder="Email"
                      className={`w-full shadow px-4 py-2 border ${
                        errors?.email
                          ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                          : "border-green-300 focus:ring-1 focus:ring-green-600 focus:outline-none"
                      } rounded-lg `}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role Input */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full shadow px-4 py-2 border ${
                        errors?.role
                          ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                          : "border-green-200 focus:ring-1 focus:ring-green-700 focus:outline-none"
                      } rounded-lg `}
                    >
                      <option value="">Select Role</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  )}
                />
                {errors.role && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`w-full shadow px-4 py-2 border ${
                          errors?.password
                            ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                            : "border-green-200 focus:ring-1 focus:ring-green-600 focus:outline-none"
                        } rounded-lg `}
                      />
                    )}
                  />
                  {isTyping && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <IoEyeSharp /> : <BsEyeSlashFill />}
                    </button>
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`w-full shadow px-4 py-2 border ${
                        errors?.confirmPassword
                          ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                          : "border-green-200 focus:ring-1 focus:ring-green-600 focus:outline-none"
                      } rounded-lg `}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-300 transition"
            >
              Register
            </button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"}>
              <a className="text-green-600 hover:underline">Login</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
