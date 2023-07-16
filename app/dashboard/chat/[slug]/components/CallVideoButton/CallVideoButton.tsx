import SignalR from "@/utils/signalR";
import React from "react";
import { BsCameraVideoFill } from "react-icons/bs";

type Props = {
  descId: string;
  setIsCallWaitingTrue: () => void;
};

const CallVideoButton = (props: Props) => {
  const connection = SignalR.Instance.HubConnection;
  const handleOnClick = () => {
    connection.invoke("SendVideoCallRequest", props.descId);
    props.setIsCallWaitingTrue();
  };
  return (
    <div className="p-2 border-2 rounded-full">
      <BsCameraVideoFill onClick={handleOnClick} className="w-6 h-auto " />
    </div>
  );
};

export default CallVideoButton;
