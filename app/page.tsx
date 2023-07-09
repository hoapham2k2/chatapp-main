"use client";
import SignalR from "@/utils/signalR";
import { useEffect, useState } from "react";
import LogoutButton from "./components/Button/LogoutButton";
import { useRouter } from "next/navigation";
import { IUserConnection } from "@/types/UserConnection";
import { useAppDispatch } from "@/features/store";
import { setUsers } from "@/features/Slice/UsersSlice/UsersSlice";

export default function Home() {
  const [userName, setUserName] = useState<string>("");

  const dispatch = useAppDispatch();
  useEffect(() => {
    const connection = SignalR.Instance.HubConnection;
    connection.start().then(() => {
      console.log("connection started with id: ", connection.connectionId);
    });

    connection.on("ReceiveMessage", (user, message) => {
      console.log("Message was received: ", user, message);
    });

    connection.on("ReceiveOnlineUsers", (data: IUserConnection[]) => {
      // const myListData: IUserConnection[] | null =
      //   data.filter(
      //     (user) => user.HubConnectionId !== connection.connectionId
      //   ) || null;
      // console.log("List friends: ", myListData);
      // dispatch(setUsers(myListData));
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
    SignalR.Instance.HubConnection.invoke("SendUserInfo", user);

    setUserName("");
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="inline-flex flex-col [&>input]:text-black"
    >
      <input
        type="text"
        name="username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <button type="submit" className="border-2" disabled={!userName}>
        Submit
      </button>
    </form>
  );
}
