"use client";

import useColorMode from "@/redux/hooks/useColorMode";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { BiSun, BiMoon, BiHomeAlt2 } from "react-icons/bi";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const pathname = usePathname();

  const [navOpen, setNavOpen] = React.useState<boolean>(false);

  return (
    <div
      className={`w-full h-14 flex justify-between border-b shadow items-center px-4 sticky top-0 z-10 ${
        colorMode === "dark"
          ? "bg-[#111113] text-white border-gray-800"
          : "bg-white text-slate-900 border-gray-300"
      }`}
    >
      <div className="logo flex items-center space-x-3">
        <div
          className={`hamburger w-5 flex cursor-pointer items-center flex-col space-y-1 md:hidden mr-2`}
          onClick={() => setNavOpen(!navOpen)}
        >
          <div
            className={`ham h-1 w-4 rounded duration-500 transition-transform origin-left ease-in-out ${
              navOpen ? "rotate-45" : "rotate-0"
            } ${colorMode === "dark" ? "bg-white" : "bg-slate-900"}`}
          ></div>
          <div
            className={`bur w-[1.39rem] h-1 rounded duration-500 transition-transform ease-in-out ${
              navOpen ? " -rotate-45" : "rotate-0"
            } ${colorMode === "dark" ? "bg-white" : "bg-slate-900"}`}
          ></div>
          <div
            className={`ger h-1 w-4 rounded duration-500 transition-transform origin-right ease-in-out ${
              navOpen ? "rotate-45" : "rotate-0"
            } ${colorMode === "dark" ? "bg-white" : "bg-slate-900"}`}
          ></div>
        </div>
        <Link href="/">
          <span className="text-2xl font-medium">PollHub</span>
        </Link>
      </div>
      <div
        className={`navoptions flex md:gap-2 flex-col md:items-center md:flex-row absolute md:relative md:translate-x-0 left-0 md:top-0 top-14 w-full md:w-max screenMinusNavHeight md:h-max duration-500 transition-transform ease-in-out ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } ${colorMode === "dark" ? "bg-[#111113]" : "bg-white"}`}
      >
        <button
          onClick={() => {
            setNavOpen(!navOpen);
            router.push("/");
          }}
          className={`cursor-pointer flex w-full md:w-max px-4 py-2 md:px-2 md:py-1 rounded-md ${
            pathname === "/"
              ? `${
                  colorMode === "dark"
                    ? "md:bg-[#EDEEF0] md:text-slate-900"
                    : "md:bg-[#1C2024] md:text-white"
                }`
              : `${
                  colorMode === "dark"
                    ? "md:hover:bg-[#212225]"
                    : "md:hover:bg-[#E1DEF2]"
                }`
          }`}
        >
          <span>Home</span>
        </button>
        <button
          onClick={() => {
            setNavOpen(!navOpen);
            router.push("/historic");
          }}
          className={`cursor-pointer flex w-full md:w-max px-4 py-2 md:px-2 md:py-1 rounded-md ${
            pathname === "/historic"
              ? `${
                  colorMode === "dark"
                    ? "md:bg-[#EDEEF0] md:text-slate-900"
                    : "md:bg-[#1C2024] md:text-white"
                }`
              : `${
                  colorMode === "dark"
                    ? "md:hover:bg-[#212225]"
                    : "md:hover:bg-[#E1DEF2]"
                }`
          }`}
        >
          <span>Previous polls</span>
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            router.push("/about");
          }}
          className={`w-9 h-9 cursor-pointer font-semibold rounded-lg flex justify-center items-center text-xl ${
            pathname === "/about"
              ? `${
                  colorMode === "dark"
                    ? "bg-[#EDEEF0] text-slate-900"
                    : "bg-[#1C2024] text-white"
                }`
              : `${
                  colorMode === "dark"
                    ? "hover:bg-[#212225]"
                    : "hover:bg-[#E1DEF2]"
                }`
          }`}
        >
          <CgProfile />
        </button>

        <button
          className={`w-9 h-9 cursor-pointer font-semibold rounded-lg flex justify-center items-center text-2xl ${
            colorMode === "dark" ? "hover:bg-[#444444]" : "hover:bg-[#eeeeee]"
          }`}
          onClick={toggleColorMode}
        >
          {colorMode === "dark" ? <BiSun /> : <BiMoon />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
