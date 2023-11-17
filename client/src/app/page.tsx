"use client";

import { AxiosError } from "axios";
import axios, { initiateInterceptor } from "../service/axiosConfig";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import useColorMode from "@/redux/hooks/useColorMode";
import CreatePoll from "@/components/CreatePoll";
import PollLayout from "@/components/PollLayout";

export interface Poll {
  id: number;
  question: string;
  name: string;
  description: string;
  createdAt: string;
  closeTime: string;
  user: { name: string };
  options: {
    id: number;
    text: string;
    votes: string[];
  }[];
}

export default function Home() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  const [activePolls, setActivePolls] = React.useState<Poll[]>([]);

  const [inactivePolls, setInactivePolls] = React.useState<Poll[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/poll`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.data;

      if (res.status === 200 && data) {
        setActivePolls(
          data.filter((poll: Poll) => new Date(poll.closeTime) > new Date())
        );
        setInactivePolls(
          data.filter((poll: Poll) => new Date(poll.closeTime) < new Date())
        );
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
      initiateInterceptor();
      fetchData();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <main
        className={`screenMinusNavHeight flex ${
          colorMode === "dark"
            ? "bg-[#101011] text-gray-100"
            : "bg-slate-50 text-gray-800"
        }`}
      >
        <div className="add hidden md:block md:w-[30%] h-full py-8 px-10">
          <CreatePoll fetchData={fetchData} />
        </div>
        <div
          className={`active w-full md:w-[40%] h-full border-x px-5 py-3 flex flex-col gap-2 max-h-full overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-md  ${
            colorMode === "dark"
              ? "border-gray-800 scrollbar-thumb-[#144240]"
              : "border-gray-300 scrollbar-thumb-[#CCF3EA]"
          }`}
        >
          <div className="text-lg font-semibold w-full text-center">Active</div>
          <div className="flex flex-col gap-2">
            {activePolls.map((poll) => {
              return (
                <PollLayout key={poll.id} poll={poll} fetchData={fetchData} />
              );
            })}
          </div>
        </div>
        <div
          className={`active hidden md:flex md:w-[30%] h-full px-5 py-3 flex-col gap-2 max-h-full overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-md ${
            colorMode === "dark"
              ? "scrollbar-thumb-[#144240]"
              : "scrollbar-thumb-[#CCF3EA]"
          }`}
        >
          <div className="text-lg font-semibold w-full text-center">
            Inactive
          </div>
          <div className="flex flex-col gap-2">
            {inactivePolls.map((poll) => {
              return (
                <PollLayout key={poll.id} poll={poll} fetchData={fetchData} />
              );
            })}
          </div>
        </div>
      </main>
    );
  }
}
