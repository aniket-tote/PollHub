"use client";

import useColorMode from "@/redux/hooks/useColorMode";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Poll } from "../page";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PollLayout from "@/components/PollLayout";

const About = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const [userPolls, setUserPolls] = React.useState<Poll[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [userData, setUserData] = React.useState<{
    id: number;
    name: string;
    email: string;
  }>({ id: 0, name: "", email: "" });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/poll/by-user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.data;

      if (res.status === 200 && data) {
        setUserPolls(res.data);
        setLoading(false);
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error as AxiosError).response?.status === 401
      ) {
        toast.error(`Your session is expired! Please login again`, {
          position: "top-center",
          duration: 2000,
        });
        router.replace("/login");
      } else {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
    } else {
      let decodedToken: {
        id: number;
        name: string;
        email: string;
        iat: number;
        exp: number;
      } = jwtDecode(JSON.stringify(localStorage.getItem("token")));
      setUserData({
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
      });
      fetchData();
    }
  }, []);

  return (
    <div
      className={`screenMinusNavHeight flex ${
        colorMode === "dark"
          ? "bg-[#101011] text-gray-100"
          : "bg-slate-50 text-gray-800"
      }`}
    >
      <div
        className={`w-1/4 border-r p-5 ${
          colorMode === "dark" ? "border-gray-800" : "border-gray-300"
        }`}
      >
        <div
          className={`border shadow p-2 flex gap-2 rounded ${
            colorMode === "dark" ? " border-gray-800" : " border-gray-300"
          }`}
        >
          <div
            className={`flex items-center border rounded-full w-16 h-16 justify-center ${
              colorMode === "dark" ? "border-gray-800" : "border-gray-300"
            }`}
          >
            {userData.name &&
              userData.name
                .split(" ")
                .map((name) => name[0].toUpperCase())
                .join("")}
          </div>

          <div className={`flex flex-col gap-1`}>
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>
      </div>
      <div
        className={`p-5 flex flex-col w-3/4 max-h-full overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-md ${
          colorMode === "dark"
            ? "scrollbar-thumb-[#144240]"
            : "scrollbar-thumb-[#CCF3EA]"
        }`}
      >
        <div className="text-lg font-semibold w-full text-start pb-2">
          My Polls
        </div>
        <div className="polls flex gap-2 w-full">
          {userPolls.map((poll) => {
            return (
              <PollLayout key={poll.id} poll={poll} fetchData={fetchData} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
