import React from "react";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  userName: string;
};

const UserButton = (props: Props) => {
  return (
    <div className="w-full p-2 flex  gap-4">
      <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
        <FaUserCircle className="w-full h-full" />
      </button>
      <div className=" flex flex-col justify-center ml-2">
        <span className="text-sm font-semibold">{props.userName}</span>
        <span className="text-xs text-gray-500">Online</span>
      </div>
    </div>
  );
};

export default UserButton;
