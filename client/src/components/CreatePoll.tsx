import useColorMode from "@/redux/hooks/useColorMode";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

const CreatePoll = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [createPollData, setCreatePollData] = React.useState<{
    name: string;
    question: string;
    options: string[];
    description: string;
    closeTime: Date;
    createdAt: Date;
  }>({
    name: "",
    question: "",
    options: ["", ""],
    description: "",
    closeTime: new Date(),
    createdAt: new Date(),
  });

  const handleInputChange = (index: number, value: string) => {
    const newOptions = [...createPollData.options];
    newOptions[index] = value;

    if (index === newOptions.length - 1) {
      newOptions.push("");
    }

    if (
      index === newOptions.length - 2 &&
      value === "" &&
      newOptions[newOptions.length - 1] === ""
    ) {
      newOptions.pop();
    }

    setCreatePollData((prevData) => ({
      ...prevData,
      options: newOptions,
    }));
  };

  return (
    <div
      className={`border shadow p-2 rounded max-h-full overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-md scrollbar-thumb-[#144240] ${
        colorMode === "dark"
          ? "bg-[#111113] text-white border-gray-800"
          : "bg-white text-slate-900 border-gray-300"
      }`}
    >
      <div className="text-lg font-semibold w-full text-center">New Poll</div>
      <form
        className="space-y-4"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          const dataWithoutEmptyOptions = {
            ...createPollData,
            options: createPollData.options.filter((option) => option !== ""),
            createdAt: new Date(),
          };
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/poll`,
            dataWithoutEmptyOptions,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const resData = await res.data;
          if (res.status === 201) {
            toast.success(`Poll created`, {
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
            setCreatePollData({
              name: "",
              question: "",
              options: ["", ""],
              description: "",
              closeTime: new Date(),
              createdAt: new Date(),
            });
          } else {
            toast.error(resData.error, {
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
          }
        }}
      >
        <div>
          <label htmlFor="question" className="block mb-2 text-sm font-medium">
            Question
          </label>
          <input
            type="text"
            name="question"
            value={createPollData.question}
            onChange={(e) => {
              setCreatePollData((preValues) => {
                return { ...preValues, question: e.target.value };
              });
            }}
            className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
              colorMode === "dark"
                ? "bg-[#101011] border-gray-800 placeholder:text-gray-600"
                : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
            }`}
            placeholder="Your question"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={createPollData.name}
            onChange={(e) => {
              setCreatePollData((preValues) => {
                return { ...preValues, name: e.target.value };
              });
            }}
            className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
              colorMode === "dark"
                ? "bg-[#101011] border-gray-800 placeholder:text-gray-600"
                : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
            }`}
            placeholder="Poll on xyz"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium"
          >
            Description
          </label>
          <textarea
            rows={2}
            name="description"
            value={createPollData.description}
            onChange={(e) => {
              setCreatePollData((preValues) => {
                return { ...preValues, description: e.target.value };
              });
            }}
            className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
              colorMode === "dark"
                ? "bg-[#101011] border-gray-800 placeholder:text-gray-600"
                : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
            }`}
            placeholder="About Poll"
          />
        </div>
        <div>
          <label htmlFor="question" className="block mb-2 text-sm font-medium">
            Options
          </label>
          <div className="flex flex-col gap-1.5">
            {createPollData.options.map((option, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                    colorMode === "dark"
                      ? "bg-[#101011] border-gray-800 placeholder:text-gray-600"
                      : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
                  }`}
                  placeholder={`option ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="closeTime" className="block mb-2 text-sm font-medium">
            Close Time
          </label>
          <input
            type="datetime-local"
            name="closeTime"
            value={createPollData.closeTime.toISOString().slice(0, 16)}
            onChange={(e) => {
              setCreatePollData((prevData) => ({
                ...prevData,
                closeTime: new Date(e.target.value),
              }));
            }}
            className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
              colorMode === "dark"
                ? "bg-[#101011] border-gray-800 placeholder:text-gray-600 [color-scheme:dark] "
                : "bg-slate-50 border-gray-300 placeholder:text-gray-400"
            }`}
            placeholder="expiry time"
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
      </form>
    </div>
  );
};

export default CreatePoll;
