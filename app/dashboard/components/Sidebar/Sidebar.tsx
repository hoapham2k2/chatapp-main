"use client";
import React, { useEffect } from "react";
import ListContact from "./ListContact";
import UserButton from "@/app/components/Button/UserButton";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import SignalR from "@/utils/signalR";

type Props = {};

const Sidebar = (props: Props) => {
  const [currentUser, setCurrentUser] = React.useState<string>("");
  const listUser = useSelector((state: RootState) => state.users.users);
  const connection = SignalR.Instance.HubConnection;

  React.useEffect(() => {
    if (listUser) {
      const user = listUser.find(
        (user) => user.connectionId === connection.connectionId
      );
      if (user) {
        setCurrentUser(user.userName);
      }
    }
  }, [listUser]);

  return (
    <div className="flex-1 p-2 sm:min-w-[200px] border border-teal-200 flex flex-col">
      <ListContact />
      <UserButton userName={currentUser} />
    </div>
  );
};

export default Sidebar;
