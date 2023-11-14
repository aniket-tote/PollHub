"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useColorMode from "@/redux/hooks/useColorMode";
import axios from "axios";

const Signup = () => {
  const { colorMode } = useColorMode();

  const [userData, setUserData] = React.useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/");
    }
  }, []);

  return (
    <div
      className={`screenMinusNavHeight w-full flex flex-col items-center px-6 py-12 ${
        colorMode === "dark"
          ? "bg-[#101011] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div
        className={`p-6 space-y-4 md:space-y-6 border rounded-lg shadow w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3 ${
          colorMode === "dark"
            ? "bg-[#111113] text-white border-gray-800"
            : "bg-white text-slate-900 border-gray-300"
        }`}
      >
        <h1 className="text-xl font-bold leading-tight w-full text-center tracking-tight md:text-2xl ">
          Create your new account.
        </h1>
        <form
          className="space-y-4 md:space-y-6"
          action="#"
          onSubmit={async (e) => {
            e.preventDefault();

            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`,
              userData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            const resData = await res.data;
            if (res.status === 201) {
              toast.success(`Welcome to the club! ${userData.name}`, {
                position: "top-center",
                duration: 2000,
                style: {
                  borderRadius: "10px",
                  border: `${
                    colorMode === "dark"
                      ? "1px solid #1F2937"
                      : "1px solid #D1D5DB"
                  }`,
                  background: `${colorMode === "dark" ? "#111113" : "#fff"}`,
                  color: `${colorMode === "dark" ? "#fff" : "#000"}`,
                },
              });
              setUserData({
                name: "",
                email: "",
                password: "",
              });
              router.push(`/login?email=${userData.email}`);
            } else {
              resData.errors.forEach((key: any) => {
                toast.error(`${key.msg}`, {
                  position: "top-center",
                  duration: 2000,
                  style: {
                    borderRadius: "10px",
                    border: `${
                      colorMode === "dark"
                        ? "1px solid #1F2937"
                        : "1px solid #D1D5DB"
                    }`,
                    background: `${colorMode === "dark" ? "#111113" : "#fff"}`,
                    color: `${colorMode === "dark" ? "#fff" : "#000"}`,
                  },
                });
              });
            }
          }}
        >
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={userData.name}
              onChange={(e) => {
                setUserData((preValues) => {
                  return { ...preValues, name: e.target.value };
                });
              }}
              className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                colorMode === "dark"
                  ? "bg-[#101011] border-gray-800 placeholder:text-gray-600"
                  : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
              }`}
              placeholder="Jhon doe"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                colorMode === "dark"
                  ? "bg-[#101011] border-gray-800 placeholder:text-gray-600"
                  : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
              }`}
              placeholder="name@company.com"
              required
              value={userData.email}
              onChange={(e) => {
                setUserData((preValues) => {
                  return { ...preValues, email: e.target.value };
                });
              }}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                colorMode === "dark"
                  ? "bg-[#101011] border-gray-800 placeholder:text-gray-600 "
                  : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
              }`}
              required
              autoComplete="on"
              value={userData.password}
              onChange={(e) => {
                setUserData((preValues) => {
                  return { ...preValues, password: e.target.value };
                });
              }}
            />
          </div>
          <button
            type="submit"
            className={`w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              colorMode === "dark"
                ? "bg-[#144240] hover:bg-[#0F2D2C]"
                : "bg-[#CCF3EA] hover:bg-[#E0F8F3]"
            }`}
          >
            Register
          </button>
          <p className="text-sm font-light text-gray-500 ">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="font-medium text-primary-600 hover:underline "
            >
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
