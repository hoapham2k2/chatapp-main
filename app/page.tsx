"use client";
import SignalR from "@/utils/signalR";
import { useEffect, useState } from "react";
import LogoutButton from "./components/Button/LogoutButton";
import { useRouter } from "next/navigation";
import { IUserConnection } from "@/types/UserConnection";
import { useAppDispatch } from "@/features/store";
import { setUsers } from "@/features/Slice/UsersSlice/UsersSlice";
import CallVideoRequestModal from "./dashboard/chat/[slug]/components/Modal/CallVideoRequestModal";

export default function Home() {
  const [userName, setUserName] = useState<string>("");

  const connection = SignalR.Instance.HubConnection;
  const dispatch = useAppDispatch();
  useEffect(() => {
    connection.start().then(() => {
      console.log("connection started with id: ", connection.connectionId);
    });

    connection.on("ReceiveMessage", (user, message) => {
      console.log("Message was received: ", user, message);
    });

    connection.on("ReceiveOnlineUsers", (data: IUserConnection[]) => {
      console.log("User was received: ", data);
      dispatch(setUsers(data));
    });

    connection.onclose(() => {
      console.log("connection closed");
    });
  }, []);

  const router = useRouter();
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = e.currentTarget.username.value;
    try {
      connection.invoke("SendUserInfo", user);
      setUserName("");
    } catch (error) {
      console.log(error);
    }
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="w-full h-full flex px-6 flex-col justify-center items-center gap-4 [&>input]:text-black"
    >
      <input
        className="w-full p-2 border-2 rounded-xl  sm:w-96  text-center text-2xl font-bold"
        type="text"
        name="username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name"
      />

      <button
        type="submit"
        className="border-2 w-full sm:w-96   p-2 rounded-xl [&:disabled]:bg-gray-400 [&:disabled]:cursor-not-allowed [&:enabled]bg-blue-500 [&:enabled]:hover:text-white [&:enabled:hover:cursor-pointer 
        "
        disabled={!userName}
      >
        Submit
      </button>
    </form>
  );
}
