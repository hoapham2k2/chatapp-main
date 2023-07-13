"use client";
import React, { useEffect } from "react";
import ListContact from "./ListContact";
import UserButton from "@/app/components/Button/UserButton";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import SignalR from "@/utils/signalR";
import { FaListUl } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

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

  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const handleOnClickOpen = () => {
    sidebarRef.current?.classList.toggle("hidden");
  };

  return (
    <div className="p-2 sm:p-0">
      <aside
        className={`sidebar sm:block sm:flex-1 sm:max-w-[16rem] sm:bg-slate-500 sm:relative sm:transition-all sm:duration-300 sm:ease-in-out
        fixed top-0 left-0 bottom-0 z-50 w-64 h-full bg-slate-500 text-white transition-all duration-300 ease-in-out hidden 
    `}
        ref={sidebarRef}
      >
        <div className="sidebar-container w-full h-full  flex flex-col">
          {/* sidebar header  */}
          <div className="flex justify-between items-center border-b p-2">
            <UserButton userName={currentUser} />
            <TiDelete
              className="w-6 h-auto cursor-pointer sm:hidden"
              onClick={handleOnClickOpen}
            />
          </div>
          {/* sidebar body */}
          <div className=" flex flex-col justify-between h-full overflow-y-auto">
            <ListContact />
          </div>
        </div>
      </aside>
      <FaListUl
        className=" sm:hidden w-6 h-auto  text-white cursor-pointer"
        onClick={handleOnClickOpen}
      />
    </div>
  );
};

export default Sidebar;
