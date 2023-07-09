"use client";
import SignalR from "@/utils/signalR";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import InputMessage from "./components/InputMessage/InputMessage";
import MessageView from "./components/MessageView/MessageView";
import IMessage from "@/types/Message";
import CallVideoButton from "./components/CallVideoButton/CallVideoButton";

type Props = {
  params: {
    slug: string;
  };
};

const DetailChat = (props: Props) => {
  const [listMessage, setListMessage] = React.useState<IMessage[]>([]);
  const { slug } = props.params;
  const connection = SignalR.Instance.HubConnection;

  //hàm thêm tin nhắn vào listMessage
  const addMessage = (message: string, isMe: boolean = false) => {
    setListMessage((prev) => [
      ...prev,
      {
        message,
        isMe,
      },
    ]);
  };

  useEffect(() => {
    if (connection.state !== "Disconnected") {
      connection &&
        connection.on("ReceiveMessageFromAnother", (message) => {
          addMessage(message, false);
        });
    }
  }, [connection]);

  return (
    <div className="p-4 w-full flex flex-col">
      <h1>Detail Chat</h1>
      <MessageView messages={listMessage} />
      <div className="flex">
        <InputMessage descId={slug} addMessage={addMessage} />
        <CallVideoButton descId={slug} />
      </div>
    </div>
  );
};

export default DetailChat;
