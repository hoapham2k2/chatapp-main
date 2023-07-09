"use client";
import SignalR from "@/utils/signalR";
import React from "react";

type Props = {};

const LogoutButton = (props: Props) => {
  const connection = SignalR.Instance.HubConnection;
  const handleOnClickLogout = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (connection.state === "Connected") {
      try {
        connection.stop();
        console.log("connection stopped");
      } catch (err) {
        console.log("error when stopping connection: " + err);
      }
    } else {
      console.log("connection is not connected");
    }
  };
  return (
    <button className="border-2" onClick={handleOnClickLogout}>
      Log out
    </button>
  );
};

export default LogoutButton;
