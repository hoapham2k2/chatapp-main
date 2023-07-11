import SignalR from "@/utils/signalR";
import React from "react";

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
  return <button onClick={handleOnClick}>CallVideoButton</button>;
};

export default CallVideoButton;
