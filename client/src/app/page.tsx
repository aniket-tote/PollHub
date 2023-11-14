"use client";

import axios, { initiateInterceptor } from "../service/axiosConfig";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  const fetchData = async () => {
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
    }
  };

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
    initiateInterceptor();
    fetchData();
  }, []);

  return (
    <main className="flex screenMinusNavHeight flex-col bg-[#101011]">
      home
    </main>
  );
}
