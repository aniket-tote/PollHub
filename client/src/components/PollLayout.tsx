import useColorMode from "@/redux/hooks/useColorMode";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";
import { Poll } from "@/app/page";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const PollLayout = ({
  poll,
  fetchData,
}: {
  poll: Poll;
  fetchData: () => {};
}) => {
  const { colorMode } = useColorMode();

  const [isVoted, setIsVoted] = React.useState<boolean>(false);

  const [isVoting, setIsVoting] = React.useState<boolean>(true);

  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  const [remainingTime, setRemainingTime] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleOptionChange = (option: string) => {
    isVoting && setSelectedOption(option);
  };

  const handlesubmit = async (optionId: string) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/poll/${poll.id}/vote/${optionId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.data;

      if (res.status === 200 && data) {
        toast.success(`Thanks for your vote!`, {
          position: "top-center",
          duration: 2000,
        });
        setIsVoted(true);
        setIsVoting(false);
        fetchData();
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
      } else {
        console.log(error);
      }
    }
  };

  const handleCancelVote = async (optionId: string) => {
    if (!isVoted) {
      setSelectedOption(null);
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/poll/${poll.id}/unvote/${optionId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.data;

      if (res.status === 200 && data) {
        toast.success(`Vote Discarded!`, {
          position: "top-center",
          duration: 2000,
        });
        setSelectedOption(null);
        setIsVoted(false);
        setIsVoting(true);
        fetchData();
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
      } else {
        console.log(error);
      }
    }
  };

  let decodedToken: {
    id: number;
    name: string;
    email: string;
    iat: number;
    exp: number;
  };

  decodedToken = jwtDecode(JSON.stringify(localStorage.getItem("token")));

  let totalVotes = 0;

  poll.options.forEach((option) => {
    totalVotes += option.votes.length;
  });

  React.useEffect(() => {
    poll.options.forEach((option) => {
      option.votes.forEach((vote: any) => {
        if (vote.user.id === decodedToken.id) {
          setIsVoted(true);
          setIsVoting(false);
          setSelectedOption(option.id.toString());
        }
      });
    });

    !isActivePoll() && setIsVoting(false);

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(poll.closeTime).getTime();

      const timeDifference = targetDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime({ days, hours, minutes, seconds });
      } else {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function timeAgo(dateString: string): string {
    const currentDate = new Date();
    const previousDate = new Date(dateString);

    const timeDifference = currentDate.getTime() - previousDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }

  const isActivePoll = () => {
    return new Date(poll.closeTime) > new Date();
  };

  return (
    <div
      className={`flex border shadow p-2 h-max min-w-[33%] rounded overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-md  ${
        colorMode === "dark"
          ? "bg-[#111113] border-gray-800 scrollbar-thumb-[#144240]"
          : "bg-white border-gray-300 scrollbar-thumb-[#CCF3EA]"
      }`}
    >
      <div className="left py-1">
        <div
          className={`profile w-11 h-11 rounded-full text-xl border flex justify-center items-center ${
            colorMode === "dark" ? "border-gray-800" : "border-gray-300"
          }`}
        >
          {poll.user.name
            .split(" ")
            .map((name) => name[0].toUpperCase())
            .join("")}
        </div>
      </div>
      <div className="pollData w-full px-2 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="nameandtime flex justify-between text-sm ">
            <div className="flex gap-2">
              <div className="name font-semibold">{poll.user.name}</div>
              <div className="time text-gray-600">
                {timeAgo(poll.createdAt)}
              </div>
            </div>
            {isActivePoll() && (
              <div className="remainingtime">
                {remainingTime.days > 0 && `${remainingTime.days} days, `}
                {`${String(remainingTime.hours).padStart(2, "0")}:${String(
                  remainingTime.minutes
                ).padStart(2, "0")}:${String(remainingTime.seconds).padStart(
                  2,
                  "0"
                )}`}
              </div>
            )}
          </div>
          <div className="question">
            <div className="font-semibold">{poll.question}</div>
          </div>
          <div
            className={`${
              colorMode === "dark" ? " text-gray-300" : " text-gray-700"
            }`}
          >
            <div className="text-sm">{poll.description}</div>
          </div>
          {(!isActivePoll() || isVoted) && (
            <div className="votes">
              <div className="text-sm text-gray-600">
                {totalVotes} {totalVotes > 1 ? "votes" : "vote"}
              </div>
            </div>
          )}
        </div>
        <div className="options w-full flex flex-col gap-1">
          {isVoting
            ? poll.options.map((option, index) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionChange(option.id.toString())}
                  className={`w-full rounded border cursor-pointer flex py-1 px-2 ${
                    colorMode === "dark"
                      ? `${
                          selectedOption === option.id.toString()
                            ? "border-[#CCF3EA]"
                            : "bg-[#101011] border-gray-800"
                        }`
                      : `${
                          selectedOption === option.id.toString()
                            ? "border-[#144240]"
                            : "bg-slate-50 border-gray-300"
                        } `
                  } `}
                >
                  <input
                    id={index.toString()}
                    className="appearance-none"
                    type="radio"
                    name={poll.id.toString()}
                    value={option.id.toString()}
                    checked={selectedOption === option.id.toString()}
                    onChange={() => {}}
                  />
                  <label htmlFor={index.toString()}>{option.text}</label>
                </div>
              ))
            : poll.options.map((option, index) => (
                <div
                  key={index}
                  className={`w-full rounded border flex ${
                    colorMode === "dark"
                      ? "bg-[#101011] border-gray-800"
                      : "bg-slate-50 border-gray-300"
                  } `}
                >
                  <div
                    className={`flex items-center gap-2 w-max justify-between py-1 px-2 ${
                      option.votes.length > 0 &&
                      (colorMode === "dark"
                        ? `${
                            selectedOption === option.id.toString()
                              ? "bg-[#144240]"
                              : "bg-gray-800"
                          } `
                        : `${
                            selectedOption === option.id.toString()
                              ? "bg-[#CCF3EA]"
                              : "bg-gray-300"
                          }`)
                    } `}
                    style={{
                      width: `${
                        option.votes.length > 0
                          ? (option.votes.length / totalVotes) * 100
                          : "max-content"
                      }%`,
                    }}
                  >
                    <p className="">{option.text}</p>
                    <div className="text-sm text-gray-600">
                      {!isActivePoll() &&
                        option.votes.length > 0 &&
                        ((option.votes.length / totalVotes) * 100).toFixed(2) +
                          "%"}
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {isActivePoll() &&
          selectedOption &&
          (isVoting ? (
            <div className="flex gap-2 w-full justify-end">
              <button
                type="submit"
                className={`px-3 py-1 border-2 rounded text-center ${
                  colorMode === "dark"
                    ? "border-[#144240] hover:bg-[#0F2D2C]"
                    : "border-[#CCF3EA] hover:bg-[#E0F8F3]"
                }`}
                onClick={() => {
                  handleCancelVote(selectedOption);
                }}
              >
                cancel
              </button>
              <button
                type="submit"
                className={`px-3 py-1 text-center rounded ${
                  colorMode === "dark"
                    ? "bg-[#144240] hover:bg-[#0F2D2C]"
                    : "bg-[#CCF3EA] hover:bg-[#E0F8F3]"
                }`}
                onClick={() => {
                  handlesubmit(selectedOption);
                }}
              >
                vote
              </button>
            </div>
          ) : (
            <div className="flex gap-2 w-full justify-end">
              <button
                type="submit"
                className={`px-3 py-1 text-center rounded ${
                  colorMode === "dark"
                    ? "bg-[#144240] hover:bg-[#0F2D2C]"
                    : "bg-[#CCF3EA] hover:bg-[#E0F8F3]"
                }`}
                onClick={() => {
                  setIsVoting(true);
                }}
              >
                Change vote
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PollLayout;
