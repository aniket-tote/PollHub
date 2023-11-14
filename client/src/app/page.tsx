"use client";

import { AxiosError } from "axios";
import axios, { initiateInterceptor } from "../service/axiosConfig";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

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
      <main className="flex screenMinusNavHeight flex-col bg-[#101011]">
        home
      </main>
    );
  }
}
