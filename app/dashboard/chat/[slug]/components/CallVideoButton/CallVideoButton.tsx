import SignalR from "@/utils/signalR";
import React from "react";

type Props = {
  descId: string;
};

const CallVideoButton = (props: Props) => {
  const connection = SignalR.Instance.HubConnection;
  const handleOnClick = () => {
    connection.invoke("SendVideoCallRequest", props.descId);
  };
  return <button onClick={handleOnClick}>CallVideoButton</button>;
};

export default CallVideoButton;
